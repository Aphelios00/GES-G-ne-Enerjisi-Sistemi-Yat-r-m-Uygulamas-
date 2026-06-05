# SolarInvest - Temiz Enerji Portföy ve Takip Platformu

Bu proje, güneş enerjisi (GES) yatırımlarını, canlı santral verilerini, blokzincir tescilli finansal loglarını ve ekolojik kurtarılan ağaç/CO2 tasarruf metriklerini takip edebileceğiniz modern, yüksek kaliteli ve tam duyarlı (**responsive**) bir React & Tailwind CSS Single Page Application (SPA) uygulamasıdır.

Uygulama, **Vercel** üzerinde en üst seviye hız ve sorunsuz yönlendirme ile yayınlanmak üzere özel olarak optimize edilmiştir.

---

## 🚀 Vercel Üzerinde Yayınlama Adımları

Uygulamayı Vercel'de yayınlamak son derece kolaydır. Aşağıdaki basit adımları takip ederek 2 dakika içinde canlıya alabilirsiniz:

### 1. Projeyi GitHub, GitLab veya Bitbucket'e Yükleyin
Eğer projeniz henüz bir Git deposunda değilse, yerel bilgisayarınızda bir depo başlatıp kodlarınızı yükleyin:
```bash
git init
git add .
git commit -m "Vercel yayını için optimizasyonlar"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/REPOSTORY_ADINIZ.git
git push -u origin main
```

### 2. Vercel Panelinde Yeni Proje Oluşturun
1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin.
2. **"Add New"** > **"Project"** butonuna tıklayın.
3. GitHub hesabınızı bağlayarak oluşturduğunuz depoyu seçin ve **"Import"** butonuna tıklayın.

### 3. Proje Ayarlarını Yapılandırın
Depoyu aktardıktan sonra Vercel, **Vite** kullanıldığını otomatik olarak tanıyacaktır. Ayarların aşağıdaki gibi olduğundan emin olun:

*   **Framework Preset:** `Vite` (Vercel bunu otomatik seçecektir)
*   **Root Directory:** `./`
*   **Build & Development Settings:**
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
    *   **Install Command:** `npm install`

### 4. Yayına Alın (**Deploy**)
*   Sayfanın altındaki **"Deploy"** butonuna tıklayın.
*   Vercel, uygulamanızı derleyecek ve size otomatik olarak **`https://ornek-proje.vercel.app`** şeklinde ücretsiz, hızlı ve SSL sertifikalı (HTTPS) bir alt alan adı tanımlayacaktır.
*   Dilerseniz **"Settings" > "Domains"** sekmesinden kendi özel alan adınızı (domain) ücretsiz olarak bağlayabilirsiniz.

---

## 🛠️ Vercel Optimizasyonları (Neler Yapıldı?)

*   **`vercel.json` Yapılandırması:** Proje kök dizinine eklenen bu ayar dosyası, web sunucusuna tüm alt sayfa isteklerini otomatik olarak `index.html`'e iletmesini söyler (SPA Rewriting). Böylece tarayıcıda sayfa yenilendiğinde (Refresh) oluşabilecek **404 Page Not Found** hatası tamamen önlenir.
*   **Hassas Klasör Koruması:** `.gitignore` dosyası, `node_modules`, `dist` derleme çıktıları ve geçici sistem dosyalarının gereksiz yere Git deponuza yüklenmesini engelleyerek temiz bir kod yapısı sunar.
*   **Vite Derleme Gücü:** Üretim (Production) aşamasında en küçük kod boyutu (Minified) ve en yüksek performans için kod optimizasyonları hazırlandı.

---

## 🌟 Önemli Teknolojiler ve Bağımlılıklar

*   **React 19 & TypeScript:** Güçlü tip korumalı modern bileşen yapısı.
*   **Tailwind CSS:** Yüksek performanslı ve modern görsel arabirim tasarımı.
*   **Motion (Framer Motion):** Sayfa ve sekme geçişlerinde akıcı, görsel animasyonlar.
*   **Lucide React:** Modern ve şık çizgi ikon kütüphanesi.
