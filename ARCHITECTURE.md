# DeskTools mimarisi ve işleyişi

Bu dosya, projeyi başka bir bilgisayarda açan bir kişi veya yapay zeka içindir. Uygulamanın ne olduğunu, neler yaptığını, katmanların nasıl bağlandığını ve bir değişikliğin nereye yazılacağını anlatır. Kod İngilizcedir. Arayüz metinleri Türkçe ve İngilizcedir.

Güncel davranış bu dosyadadır. `README.md` içindeki bazı kurulum ve sürüm cümleleri eskidir. Çelişki olursa bu dosya ve kaynak kod geçerlidir.

İşleyiş veya mimari değişince bu dosya da aynı değişiklikle güncellenir. Yeni veya kalkan araç, rota, yetki, kayıt dosyası ve artık çalışan ya da duran bir adım buraya yazılır. Yalnızca üslup veya test değişikliği bu dosyayı gerektirmez.

## Ne olduğu

DeskTools, Windows 10/11 x64 için çevrimdışı çalışabilen bir masaüstü araç kutusudur. Tek pencerede dosya, resim, PDF, geliştirici, internet, sistem, metin ve hesap araçlarını toplar. Araçlar birbirinin durumuna bağlanmaz. Yeni bir araç, kendi klasörüne ve tek bir kayıt listesine eklenir.

Ürün adı DeskTools. Paket adı `desktools`. Tauri kimliği `com.desktools.desktop`. Kaynak deposu `https://github.com/claireass/desktools`, dal `main`. Sürüm bu yazıldığı sırada **0.5.0**.

Kurulu uygulama Başlat menüsündeki DeskTools’tur. `npm run tauri dev` ile açılan pencere geliştirme penceresidir. Güncelleme denemesi kurulu uygulamadan yapılır. Geliştirme penceresi zaten kaynak koddaki sürümü çalıştırdığı için kendisine güncelleme görmez.

## Teknoloji

- Arayüz: React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Zustand, Lucide
- Masaüstü kabuğu: Tauri 2, Rust
- Kalıcı veri: `@tauri-apps/plugin-store`
- Günlük: `@tauri-apps/plugin-log`
- Güncelleme: `@tauri-apps/plugin-updater` ve `@tauri-apps/plugin-process` içindeki yeniden başlatma
- Dış bağlantı: `@tauri-apps/plugin-opener`, yalnızca depo adresini açmak için
- Test: Vitest. Biçim: Prettier, çift tırnak, satır genişliği 90. Denetim: ESLint

Tarayıcıda `npm run dev` adresi `http://localhost:1420` olur. Bu oturum Tauri değildir. Ayarlar yalnızca o sekmenin belleğinde durur ve sayfa yenilenince silinir.

## Klasörler

- `src/app`: `App`, sağlayıcılar ve rotalar
- `src/components`: kabuk, kenar çubuğu, arama, tema, düğme ve boş durum
- `src/pages`: Ana sayfa, kategori, araç, favoriler, son kullanılanlar, ayarlar, hakkında
- `src/features/<arac-id>`: bir aracın görünümü, saf hesabı ve `index.ts` varsayılan dışa aktarımı
- `src/services`: araç kaydı, arama, kalıcılık, güncelleme, platform kontrolü
- `src/stores`: Zustand mağazaları
- `src/i18n/messages.ts`: Türkçe ve İngilizce metinlerin tek listesi
- `src/constants/appConfig.ts`: ad, depo sahibi, depo adı, güncelleme kanalı
- `src-tauri`: Rust kabuğu, pencere, yetkiler, NSIS kurulumu, güncelleyici ayarı
- `tests`: Vitest birim testleri
- `scripts/check-version.mjs`: üç sürüm dosyasının aynı olduğunu doğrular

Sürüm üç yerde aynı olmak zorundadır: `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`. Vite, `package.json` sürümünü derleme sırasında `__APP_VERSION__` olarak arayüze gömer. `npm run check:version` farklıysa başarısız olur. `package-lock.json` ve `src-tauri/Cargo.lock` içindeki `desktools` kaydı da aynı sürüme çekilir. Başka paketlerin sürümüne dokunulmaz.

## Açılış akışı

1. `src/main.tsx` React ağacını kurar.
2. `AppProviders` ilk çalıştırmada `requestHydrate()` çağırır ve `BrowserRouter` açar.
3. `ThemeSync` tema tercihini pencereye uygular. Masaüstünde bu, Tauri pencere teması iznini kullanır.
4. `AppShell` kenar çubuğu, üst çubuk ve `Outlet` ile sayfa içeriğini gösterir.
5. İlk açılışta karşılama penceresi vardır. “Başla” `hasCompletedOnboarding` değerini kaydeder.

Rotalar `src/app/routes.tsx` içindedir:

- `/` ana sayfa
- `/favorites` favoriler
- `/recent` son kullanılanlar
- `/category/:categoryId` kategori
- `/tool/:toolId` araç
- `/settings` ayarlar
- `/about` hakkında

Dil, ilk çalıştırmada tarayıcı dili `tr` ile başlıyorsa Türkçe, değilse İngilizcedir. Tema `system`, `light` veya `dark` olabilir.

## Araçların işleyişi

Bütün araçlar `src/services/toolRegistry.ts` içindeki `tools` dizisindedir. Her kayıtta `id`, çeviri anahtarları, kategori, simge adı, arama etiketleri ve `load` fonksiyonu vardır. `load`, `import("@/features/<id>")` ile o aracın varsayılan React bileşenini getirir.

`/tool/:toolId` sayfası kayıttan aracı bulur, başlık ve açıklamayı çevirir, bileşeni bir kez yükleyip bellekte tutar ve son kullanılanlara yazar. Kayıtta olmayan bir id boş durum gösterir.

Arama Ctrl+K ile açılır. Sorgu, çevrilmiş ad, açıklama, kategori ve etiketler üzerinde puanlanır. Ağ çağrısı yoktur.

Yeni araç ekleme sırası:

1. `src/features/<arac-id>/` altında saf hesap (`logic.ts`), görünüm ve `index.ts` içinde `export { View as default }`.
2. `toolRegistry.ts` dizisine tek kayıt.
3. `src/i18n/messages.ts` içine aynı anahtarlar, önce Türkçe sonra İngilizce. İngilizce nesne, Türkçe anahtarların hepsini taşımak zorundadır. TypeScript eksik anahtarı derlemede yakalar.
4. `tests/toolSearch.test.ts` içindeki sıralı id listesine yeni id.
5. Hesabın birim testi.

Araçlar birbirinin mağazasını okumaz. Ortak ihtiyaçlar `src/utils` veya `src/features` altındaki paylaşılan klasörlere konur. Örnekler: `image-shared`, `pdf-shared`.

## Araçlar

Kimlikler kayıt listesindeki adlardır.

Dosya:

- `file-info`: seçilen dosyanın adı, uzantısı ve boyutu
- `size-analyzer`: seçilen dosyalar arasında en büyük olanı ve boyutları
- `file-renamer`: yeni ad önizlemesi. Geçerli kopyalar indirilir. Özgün dosya değişmez

Resim:

- `image-converter`, `image-resizer`, `image-compressor`: tuval üzerinde kopya üretir ve indirir. Özgün dosya yerinde kalır

PDF:

- `pdf-merge`, `pdf-split`, `pdf-extract`: `pdf-lib` ile bellekte yeni PDF üretir ve indirir. Özgün dosya değişmez

Geliştirici:

- `json-formatter`: biçimlendirir veya tek satıra küçültür
- `url-codec`: `encodeURIComponent` ve `decodeURIComponent`
- `timestamp`: Unix zamanı ile UTC tarihi, saniye veya milisaniye
- `regex-tester`: deseni ayrı bir Worker içinde dener. Bir saniyeden uzun sürerse Worker durdurulur. Desen en fazla 200, örnek metin en fazla 10000 karakter olabilir. En fazla 50 eşleşme gösterilir
- `jwt-decoder`: başlık ve yükü yerelde okur. İmzayı doğrulamaz. Algoritma `none` ise veya imza boşsa uyarı gösterir. Belirteç 8192 karakterden uzunsa reddedilir
- `cron`: beş alanlı cron ifadesinin sonraki UTC çalışmalarını, en fazla bir yıl ileriye, dakika dakika hesaplar. Ayın günü ve haftanın günü birlikte kısıtlıysa ikisinden biri uyması yeter. Haftanın gününde 0 pazardır
- `base64`: metin kodlama ve çözme
- `uuid-generator`: rastgele UUID
- `password-generator`: `crypto.getRandomValues` ile parola üretir. Parola kaydedilmez ve günlüğe yazılmaz. Uzunluk 8 ile 128 arasındadır. Entropi, seçilen alfabenin bit cinsinden yaklaşık büyüklüğüdür
- `hash-generator`: MD5, SHA-1, SHA-256, SHA-512

İnternet kategorisi ağa bağlanmaz. Hesaplar yerelde yapılır:

- `url-parser`: adresin şema, sunucu, yol, sorgu ve parça alanları
- `subnet-calculator`: IPv4 alt ağ
- `http-status`: bilinen durum kodlarının açıklaması

Sistem:

- `clipboard`: pano yalnızca düğmeye basılınca okunur
- `system-info`: oturum bilgisi. Masaüstünde buna işletim sistemi ve mimari eklenir

Metin:

- `text-counter`, `case-converter`, `line-tools`
- Türkçe büyük harf `toLocaleUpperCase("tr")` kullanır

Hesap:

- `calculator`, `percentage`, `unit-converter`, `date-calculator`
- Tarih farkları UTC takvim günüdür

## Kalıcı veri

Masaüstünde üç dosya, Tauri store ile uygulama veri klasörüne yazılır:

- `settings.json`
- `favorites.json`
- `recent.json`

Favoriler araç id dizisidir. Son kullanılanlar en fazla 30 kayıttır.

Ayar alanları: `theme`, `locale`, `sidebarCollapsed`, `hasCompletedOnboarding`, `launchAtStartup`, `closeToTray`, `checkForUpdates`. Son üçü varsayılan olarak kapalıdır.

`launchAtStartup` ve `closeToTray` yalnızca kaydedilir. Windows açılış kaydı oluşturulmaz ve tepsi simgesi yoktur. Arayüz bunu açıkça söyler.

`checkForUpdates` açıkken Ayarlar sayfasında “Şimdi denetle” düğmesi görünür. Uygulama açılışta kendi kendine güncelleme aramaz.

Tarayıcı oturumunda aynı dosyalar bellek haritasındadır. Kalıcı değildir.

## Güncelleme akışı

Masaüstü denetlemesi:

1. `check()` yalnızca sürüm kaydını okur. İndirmez.
2. Kayıt daha yeniyse kaynak, bekleyen güncellemeyi bellekte tutar.
3. Pencere “İndirmek ister misin?” diye sorar.
4. “İndir ve kur” `downloadAndInstall()` sonra `relaunch()` çağırır.
5. “Şimdi değil”, Esc veya arka plan, güncelleme kaynağını kapatır ve teklifi siler.

Kayıt adresi:

`https://github.com/claireass/desktools/releases/latest/download/latest.json`

`latest.json` alanı `version` öneksiz sürümdür, örneğin `0.5.0`. Platform anahtarı `windows-x86_64` olur. `signature` kurulum dosyasının `.sig` içeriğidir. `url`, o sürümün `DeskTools_<sürüm>_x64-setup.exe` indirme adresidir. GitHub “latest”, en son yayımlanan sürümdür.

İmza, `tauri.conf.json` içindeki açık anahtarla doğrulanır. Özel anahtar depoda, sohbette ve GitHub’da yoktur. İlk makinede kullanıcı profilindeki `.tauri` klasöründedir. Bu anahtar kaybolursa kurulmuş kopyalar yeni sürüme geçemez. Anahtar dosyası repoya konmaz.

Kurulum NSIS, `perMachine`, Türkçe ve İngilizce dil, Windows kurulum kipi `passive` olur. Yönetici onayı isteyebilir. WiX üretilmez.

Tarayıcı oturumu GitHub API ile sürümü okur ve indirmez. İndirme düğmesi tarayıcıda çıkmaz.

0.2.0 sürümünden kalan kurulu kopyalar, soran kod henüz içlerinde olmadığı için bir sonraki sürümü sormadan kurar. 0.2.1 ve sonrası sorar.

## Masaüstü kabuğu

`src-tauri/src/lib.rs` eklentileri kurar: opener, store, process, updater, log. Tek Rust komutu `get_app_info` ad, sürüm, işletim sistemi ve mimari döndürür.

Pencere etiketi `main`, süsleri açık, en az 960×640, varsayılan 1100×720.

Yetkiler `src-tauri/capabilities/default.json` içindedir. Kabuk komutu, süreç sonlandırma ve dosya sistemi geniş izni yoktur. Opener yalnızca `https://github.com/claireass/desktools` adresini açabilir. Klasör gösterme ve yerel program çalıştırma izni yoktur.

Günlük düzeyi info. Windows’ta günlükler `LocalAppData\com.desktools.desktop\logs` altındadır. Parola, JWT ve dosya içeriği günlüğe yazılmaz.

İçerik güvenlik ilkesi arayüzün kendi kaynağına, Tauri IPC adreslerine ve güncelleme sorgusu için `https://api.github.com` adresine izin verir.

## Güvenlik sınırları

- Dosya, resim ve PDF araçları kullanıcının seçtiği baytları okur. Özgün dosyayı diske yazmaz. İndirilen ad, yol ayırıcılarından ve Windows aygıt adlarından (`con.txt` gibi) arındırılır.
- İnternet araçları uzak sunucuya bağlanmaz.
- Pano yalnızca istenince okunur.
- JWT okuyucu güven kararı vermez. İmza doğrulaması yoktur.
- Düzenli ifade ana iş parçacığını kilitlemesin diye Worker içinde ve süre sınırılı çalışır.
- Parola üretici çıktıyı saklamaz.

## Derleme ve yayın

Geliştirme: `npm install`, sonra `npm run tauri dev`. Rust, Visual Studio C++ build tools ve WebView2 gerekir.

Kontrol: `npm run check:version`, `npm run lint`, `npm test`, `npm run build`.

Kurulum dosyası `npm run tauri build` ile üretilir. Çıktı:

`src-tauri/target/release/bundle/nsis/DeskTools_<sürüm>_x64-setup.exe`

Yanında aynı adda `.sig` dosyası oluşur. `latest.json` bu derlemenin parçası değildir. Yayın sırasında `.sig` içeriği okunup `latest.json` yazılır, sonra ikisi ve kurulum dosyası `gh release create` ile `vX.Y.Z` etiketine yüklenir.

Yayınlanan kurulumlar `https://github.com/claireass/desktools/releases` adresindedir.

Lisans seçilmedi. Depoda `LICENSE` dosyası yoktur. Gizli anahtar, `.env` ve `src-tauri/target` repoya girmez.
