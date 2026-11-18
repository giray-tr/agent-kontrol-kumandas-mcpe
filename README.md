# agent-kontrol-kumandas-mcpe

Orijinal Minecraft Bedrock / Pocket Edition oyununa hızlıca canlı bağlantı kurarak Agent'ı ve matematiksel 3D yapıları web üzerinden yönetmenizi sağlayan kontrol paneli.

## Kurulum (Termux)

Cihazınızda **Termux** uygulamasını açın ve aşağıdaki komutları sırasıyla yapıştırıp çalıştırın:

```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y
git clone https://github.com
cd agent-kontrol-kumandas-mcpe
npm install
node server.js
```

*(Not: İlk kurulumdan sonra sunucuyu tekrar başlatmak için sadece `cd agent-kontrol-kumandas-mcpe && node server.js` yazmanız yeterlidir.)*

## Nasıl Kullanılır?
- **Kontrol Panelini Açma:** Tarayıcınızdan `http://127.0.0.1:3000` adresine girin.
- **Minecraft Bağlantısı:** Oyunda hileleri açıp sohbete `/connect 127.0.0.1:3000` yazın.

## Gereksinimler ve Özellikler
- Sadece **Minecraft Bedrock / Pocket Edition (1.21+)** sürümleri içindir.
- İçerisinde π (Pi) ve trigonometri kullanarak **Çember, 3D Cam Kubbe, 3D DNA Sarmalı ve Sinüs Dalgası** ören otomatik matematik motoru bulunur.
- Termux arka planda açık kaldığı sürece sistem **7/24 kesintisiz** çalışır.
- 
