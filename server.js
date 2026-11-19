const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let minecraftClients = new Set();
let webClients = new Set();

function sendCommandToMinecraft(commandLine) {
  const payload = JSON.stringify({
    header: {
      version: 1,
      requestId: crypto.randomUUID(),
      messageType: 'commandRequest',
      messagePurpose: 'commandRequest'
    },
    body: {
      commandLine: commandLine,
      version: 1
    }
  });

  let sentCount = 0;
  minecraftClients.forEach((mc) => {
    if (mc.readyState === WebSocket.OPEN) {
      mc.send(payload);
      sentCount++;
    }
  });
  return sentCount;
}

function broadcastStatus() {
  const statusMsg = JSON.stringify({
    type: 'status',
    mcConnected: minecraftClients.size > 0,
    mcCount: minecraftClients.size
  });
  webClients.forEach((web) => {
    if (web.readyState === WebSocket.OPEN) {
      web.send(statusMsg);
    }
  });
}

wss.on('connection', (ws, req) => {
  const url = req.url || '/';

  if (url.startsWith('/web')) {
    webClients.add(ws);
    broadcastStatus();

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'command' && msg.cmd) {
          const count = sendCommandToMinecraft(msg.cmd);
          ws.send(JSON.stringify({
            type: 'log',
            text: `Komut gönderildi (${count} oyun): /${msg.cmd}`
          }));
        }
      } catch (err) {
        ws.send(JSON.stringify({ type: 'log', text: 'Hatalı mesaj formatı.' }));
      }
    });

    ws.on('close', () => {
      webClients.delete(ws);
    });
  } else {
    minecraftClients.add(ws);
    broadcastStatus();

    webClients.forEach((web) => {
      if (web.readyState === WebSocket.OPEN) {
        web.send(JSON.stringify({ type: 'log', text: '✔ Minecraft oyuna bağlandı!' }));
      }
    });

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.body && parsed.body.statusMessage) {
          webClients.forEach((web) => {
            if (web.readyState === WebSocket.OPEN) {
              web.send(JSON.stringify({
                type: 'log',
                text: `Oyun Yanıtı: ${parsed.body.statusMessage}`
              }));
            }
          });
        }
      } catch (e) {}
    });

    ws.on('close', () => {
      minecraftClients.delete(ws);
      broadcastStatus();
      webClients.forEach((web) => {
        if (web.readyState === WebSocket.OPEN) {
          web.send(JSON.stringify({ type: 'log', text: '✖ Minecraft bağlantısı kesildi.' }));
        }
      });
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
