const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let mcSocket = null;
const webClients = new Set();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function broadcast(obj) {
  const str = JSON.stringify(obj);
  webClients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(str); });
}

function sendMC(cmd) {
  if (mcSocket && mcSocket.readyState === WebSocket.OPEN) {
    mcSocket.send(JSON.stringify({
      header: {
        version: 1,
        requestId: crypto.randomUUID(),
        messageType: 'commandRequest',
        messagePurpose: 'commandRequest'
      },
      body: { commandLine: cmd, version: 1 }
    }));
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function buildMathStructure(shape, radius = 6, block = 'sea_lantern') {
  if (shape === 'circle') {
    for (let theta = 0; theta < 2 * Math.PI; theta += 0.15) {
      const x = Math.round(radius * Math.cos(theta));
      const z = Math.round(radius * Math.sin(theta));
      sendMC(`execute as @e[type=agent] at @s run setblock ~${x} ~ ~${z} ${block}`);
      await sleep(40);
    }
  } else if (shape === 'spiral') {
    for (let i = 0; i <= 60; i++) {
      const theta = i * (Math.PI / 8);
      const x = Math.round(radius * Math.cos(theta));
      const z = Math.round(radius * Math.sin(theta));
      const y = Math.floor(i / 3);
      sendMC(`execute as @e[type=agent] at @s run setblock ~${x} ~${y} ~${z} ${block}`);
      await sleep(45);
    }
  } else if (shape === 'dome') {
    for (let phi = 0; phi <= Math.PI / 2; phi += 0.2) {
      const rLayer = radius * Math.cos(phi);
      const y = Math.round(radius * Math.sin(phi));
      for (let theta = 0; theta < 2 * Math.PI; theta += 0.2) {
        const x = Math.round(rLayer * Math.cos(theta));
        const z = Math.round(rLayer * Math.sin(theta));
        sendMC(`execute as @e[type=agent] at @s run setblock ~${x} ~${y} ~${z} glass`);
        await sleep(25);
      }
    }
  } else if (shape === 'sinwave') {
    for (let x = 0; x <= 24; x++) {
      const y = Math.round(4 * Math.sin((x * Math.PI) / 6));
      sendMC(`execute as @e[type=agent] at @s run setblock ~${x} ~${y + 4} ~ diamond_block`);
      await sleep(40);
    }
  }
}

wss.on('connection', (ws, req) => {
  const ua = req.headers['user-agent'] || '';
  if (!ua.includes('Mozilla')) {
    mcSocket = ws;
    broadcast({ type: 'status', connected: true });
    ws.on('close', () => {
      mcSocket = null;
      broadcast({ type: 'status', connected: false });
    });
  } else {
    webClients.add(ws);
    ws.send(JSON.stringify({ type: 'status', connected: mcSocket !== null && mcSocket.readyState === WebSocket.OPEN }));
    ws.on('message', (raw) => {
      let cmd = raw.toString();
      try {
        const p = JSON.parse(cmd);
        if (p.mathShape) {
          buildMathStructure(p.mathShape, Number(p.radius) || 6, p.block || 'sea_lantern');
          return;
        }
        cmd = p.command || p.cmd || p.action || cmd;
      } catch (e) {}
      cmd = cmd.trim();
      if (cmd.startsWith('/')) cmd = cmd.slice(1);

      const map = {
        'agent move forward': 'execute as @e[type=agent] at @s run tp @s ^ ^ ^1',
        'agent move back': 'execute as @e[type=agent] at @s run tp @s ^ ^ ^-1',
        'agent move left': 'execute as @e[type=agent] at @s run tp @s ^1 ^ ^',
        'agent move right': 'execute as @e[type=agent] at @s run tp @s ^-1 ^ ^',
        'agent move up': 'execute as @e[type=agent] at @s run tp @s ~ ~1 ~',
        'agent move down': 'execute as @e[type=agent] at @s run tp @s ~ ~-1 ~',
        'agent turn left': 'execute as @e[type=agent] at @s run tp @s ~ ~ ~ ~-90 ~',
        'agent turn right': 'execute as @e[type=agent] at @s run tp @s ~ ~ ~ ~90 ~',
        'agent destroy forward': 'execute as @e[type=agent] at @s run setblock ^ ^ ^1 air destroy',
        'agent place 1 forward': 'execute as @e[type=agent] at @s run setblock ^ ^ ^1 stone',
        'agent tp @p': 'tp @e[type=agent] @p'
      };
      sendMC(map[cmd] || cmd);
    });
    ws.on('close', () => webClients.delete(ws));
  }
});

server.listen(3000, () => console.log('Sunucu 3000 portunda çalışıyor.'));
        
