# EgePluginBuilder

HTML, CSS ve JavaScript ile genel amaçlı eklenti başlangıç dosyaları oluşturan, Türkçe ve mobil uyumlu tarayıcı aracı.

## Özellikler
- Temel web eklentisi, popup arayüzü ve içerik betiği şablonları
- Proje adı, kimliği, açıklama ve lisans seçimi
- README, LICENSE ve genel proje manifesti üretimi
- Üretilen dosyaları tarayıcıda önizleme
- ZIP olarak indirme

## Kullanım
1. GitHub Pages'i etkinleştir veya dosyaları bir web sunucusuna kopyala.
2. `index.html` dosyasını aç.
3. Proje bilgilerini düzenle ve **Dosyaları oluştur** düğmesine bas.
4. **ZIP olarak indir** ile proje arşivini al.

## GitHub Pages
Repository → Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)` → Save.

Yayın bağlantısı şu formatta olur: `https://egeserifsari90-ctrl.github.io/EgePluginBuilder/`

## Sınırlar
Bu araç genel web başlangıç dosyaları üretir. `manifest.json` evrensel veya resmi bir tarayıcı eklentisi manifesti değildir. Chrome/Firefox/CapCut veya başka bir ürünle entegrasyon için hedef platformun resmi geliştirme belgeleri, izinleri ve API'leri gerekir. Araç herhangi bir platform hesabına bağlanmaz ve kimlik bilgisi toplamaz.

## Teknoloji
Vanilla HTML, CSS ve JavaScript. ZIP indirme için JSZip CDN kullanılır.
