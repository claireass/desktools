# DeskTools

Windows için modern, çevrimdışı çalışabilen ve genişletilebilir bir masaüstü araç kutusu.

Mimari, araçlar ve güncelleme akışı [ARCHITECTURE.md](ARCHITECTURE.md) içindedir. Bu dosyadaki bazı kurulum cümleleri eskidir. Güncel işleyiş oradadır.

## Features

- Daraltılabilir kenar çubuğu ve kategori sayfaları
- Açık, koyu ve sistem teması
- Türkçe ve İngilizce arayüz
- Ctrl+K ile araç arama
- Favoriler ve son kullanılanlar
- Araçların tek bir kayıt listesinden okunması
- JSON Formatter, metin sayacı, UUID üretici, hash üretici ve hesap makinesi
- Dosya bilgisi, boyut analizi ve yeniden adlandırma önizlemesi
- Resim dönüştürme, boyutlandırma ve sıkıştırma
- PDF birleştirme, bölme ve sayfa ayıklama
- URL ayrıştırma, IPv4 alt ağ hesabı ve HTTP durum kodu
- Pano ve oturum sistem bilgisi
- Harf dönüştürme, satır işlemleri, yüzde, birim ve tarih hesabı
- Başlangıç, tepsi ve güncelleme tercihleri kaydedilir; bu sürümde uygulanmaz

## Installation

Yerel kurulum dosyası `npm run tauri build` ile üretilir:

`src-tauri/target/release/bundle/nsis/DeskTools_<sürüm>_x64-setup.exe`

Yayınlanan kurulum [GitHub Releases](https://github.com/claireass/desktools/releases) içindedir.

Kurulum tüm kullanıcılar içindir (`Program Files`), Başlat menüsüne kısayol ekler ve kaldırıcı oluşturur. Yönetici onayı ister. Bu dosya imzalı değildir ve GitHub Release olarak yayımlanmamıştır.

## Development

Gerekenler: Node.js, Rust, Windows için Visual Studio C++ build tools ve WebView2.

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run check:version
npm run lint
npm test
npm run build
npm run tauri build
```

## Release

Sürüm `package.json`, `src-tauri/tauri.conf.json` ve `src-tauri/Cargo.toml` içinde aynı olmalıdır. `npm run check:version` farklıysa başarısız olur.

GitHub release ve imzalama bu sürümde yoktur.

## Update System

Depo adresi [github.com/claireass/desktools](https://github.com/claireass/desktools). Masaüstü pencerede “Şimdi denetle”, `latest.json` kaydını imzayla doğrular. Kayıttaki sürüm daha yeniyse indirmeden önce sorar. Onaydan sonra kurulum dosyasını indirir ve kurar. Tarayıcı oturumu yalnızca sürümü bildirir, indirmez. Özel imza anahtarı depoda yoktur.

## Architecture

- Arayüz: React, TypeScript, Vite, Tailwind CSS
- Masaüstü kabuğu: Tauri 2
- Kalıcı ayarlar: `tauri-plugin-store` (uygulama veri klasörü, `com.desktools.desktop`)
- Günlük: `tauri-plugin-log`, info / warn / error. Windows’ta günlükler `LocalAppData\com.desktools.desktop\logs` altındadır.
- Yeni araç: `src/features/<tool-id>/` ve `src/services/toolRegistry.ts`

Kabuğa ve süreç başlatmaya izin verilmez. Dosya, resim ve PDF araçları yalnızca kullanıcının seçtiği dosyayı okur ve özgün dosyayı diskte değiştirmez. İnternet araçları ağa bağlanmaz. Pano yalnızca istenince okunur.

## Contributing

Araçlar birbirine bağlanmadan, kayıt listesine tek satırla eklenmelidir. Kullanıcı metinleri `src/i18n/messages.ts` içine yazılır.

## License

Lisans henüz seçilmedi.

## Ekran görüntüleri

Henüz eklenmedi.
