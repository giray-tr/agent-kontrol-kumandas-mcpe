# agent-kontrol-kumandas-mcpe

Orijinal **Minecraft Bedrock / Pocket Edition (1.21+)** oyununa saniyeler içinde canlı bağlantı kurarak Agent'ı yönetmenizi, oyundaki hareketlerinizi canlı takip etmenizi ve matematiksel 3D yapılar inşa etmenizi sağlayan gelişmiş WebSocket kontrol ve radar paneli.

## Özellikler

- **Agent Gözünden İzleme (Kamera Modu):** Tek tuşla oyundaki kameranızı Agent'ın bakış açısına kilitler ve Agent hareket ettikçe onun gözünden dünyayı canlı izlemenizi sağlar.
- **Canlı Radar & İstatistik Karşılaştırması:** Hem sizin hem de Agent'ın kırdığı blok, koyduğu blok ve attığı adım sayılarını anlık olarak sayar ve ekranda karşılaştırır.
- **Envanter & Slot Kontrolü:** Agent'ın `1–27` arasındaki envanter slotlarını seçmenizi, slot içeriğini kontrol etmenizi ve kendi oyuncu koordinat/durum verilerinizi taramanızı sağlar.
- **Tam Yönlü Hareket & Blok Yönetimi:** İleri, geri, sağa, sola, yukarı ve aşağı yönlerine hareket etme, dönme, blok kırma, blok koyma ve eşya toplama komutlarını açılır-kapanır menülerle sunar.
- **Matematiksel 3D Yapı Motoru (π & Trigonometri):** Sinüs, kosinüs ve Pi (π) formüllerini kullanarak tek tuşla **π Çemberi, 3D Cam Kubbe, 3D DNA Sarmalı ve Sinüs Dalgası** inşa eder.
- **Sihirli Sohbet Komutları (Chat Triggers):** Oyun içi sohbete yazılan özel komutları algılar:
  - `!elmas` — Altınızdaki zemini elmas bloklarıyla kaplar.
  - `!ziplat` — Karakterinizi gökyüzüne fırlatır.
  - `!gunduz` — Havayı anında sabah yapar.

## Kurulum (Termux)

Android cihazınızda **Termux** uygulamasını açın ve aşağıdaki komutları sırasıyla çalıştırın:

```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y
git clone https://github.com/giray-tr/agent-kontrol-kumandas-mcpe.git
cd agent-kontrol-kumandas-mcpe
npm install
node server.js
```

### Arka Planda 7/24 Çalıştırma (İsteğe Bağlı)

Sunucunun terminal kapansa bile arka planda kesintisiz çalışması için PM2 kullanabilirsiniz:

```bash
npm install -g pm2
pm2 start server.js --name mc-agent
```

## Nasıl Kullanılır?

1. Tarayıcınızdan `http://127.0.0.1:3000` adresini açın.
2. Minecraft Bedrock'ta hilelerin aktif olduğu dünyanıza girin.
3. Oyun içi sohbeti açıp `/connect 127.0.0.1:3000` komutunu gönderin.
4. Üstteki bağlantı göstergesi yeşile döndüğünde paneldeki tüm butonları ve kamera modunu kullanmaya başlayabilirsiniz.
