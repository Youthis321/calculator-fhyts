# 🚀 Deploy Calculator App ke Vercel

## 📋 Panduan Deployment

Calculator App sudah siap untuk di-deploy ke Vercel! Ikuti langkah-langkah berikut:

### 🔧 Persiapan Deployment

#### 1. **Install Vercel CLI (Opsional)**
```bash
npm install -g vercel
```

#### 2. **Login ke Vercel**
```bash
vercel login
```

### 🌐 Deployment ke Vercel

#### **Metode 1: Deploy via GitHub (Recommended)**

1. **Push ke GitHub Repository**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Connect di Vercel Dashboard**
- Buka [vercel.com](https://vercel.com)
- Login dengan GitHub account
- Click "New Project"
- Import repository `calculator-fhyts`
- Vercel akan otomatis detect settings

3. **Environment Configuration**
- Tidak perlu environment variables khusus
- Vercel akan menggunakan `vercel.json` configuration

#### **Metode 2: Deploy via CLI**

1. **Deploy langsung dari terminal**
```bash
cd calculator-fhyts
vercel --prod
```

2. **Follow CLI prompts**
- Set up project name: `calculator-fhyts`
- Link to existing project: No (jika pertama kali)
- Override settings: No (gunakan vercel.json)

### ⚙️ Konfigurasi Deployment

#### **File yang Sudah Disiapkan:**

1. **`vercel.json`** - Konfigurasi Vercel
```json
{
  "version": 2,
  "name": "calculator-fhyts",
  "builds": [
    {
      "src": "app.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/public/(.*)",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/app.ts"
    }
  ]
}
```

2. **`package.json`** - Scripts untuk build
```json
{
  "scripts": {
    "start": "node dist/app.js",
    "build": "tsc && npm run copy:assets",
    "vercel-build": "npm run build",
    "postinstall": "npm run build"
  }
}
```

3. **`app.ts`** - Entry point dengan serverless support
- Mendukung local development (`npm run dev`)
- Mendukung serverless deployment (Vercel)

### 🔍 URL Setelah Deployment

Setelah deployment berhasil, aplikasi akan tersedia di:
- **Production URL**: `https://calculator-fhyts.vercel.app`
- **Custom Domain**: Bisa diatur di Vercel dashboard

### 📊 Fitur yang Tersedia

#### **Basic Calculator**: `/`
- Calculator sederhana dengan operasi dasar
- Link ke Advanced Calculator

#### **Advanced Calculator**: `/calculator`
- Scientific calculator functions
- Unit converter
- Calculation history
- Memory functions

#### **API Endpoints**:
- `POST /api/calculate` - Basic calculations
- `POST /api/scientific` - Scientific operations
- `POST /api/memory` - Memory functions
- `GET /api/history` - Get history
- `DELETE /api/history` - Clear history
- `POST /api/convert` - Unit conversions

### 🛠️ Development vs Production

#### **Local Development**
```bash
npm install
npm run dev
# Akses: http://localhost:3000
```

#### **Production Build**
```bash
npm run build
npm start
# Akses: http://localhost:3000
```

#### **Vercel Deployment**
- Automatic builds dari GitHub
- Serverless functions
- Global CDN
- HTTPS certificate otomatis

### 🔧 Troubleshooting

#### **Common Issues:**

1. **Build Errors**
```bash
# Clear cache dan rebuild
rm -rf node_modules dist
npm install
npm run build
```

2. **TypeScript Errors**
- Semua dependencies sudah di `dependencies` (bukan `devDependencies`)
- TypeScript compiler termasuk dalam production build

3. **Static Assets Not Loading**
- Vercel akan serve static files dari `/public`
- Routes sudah dikonfigurasi di `vercel.json`

4. **API Routes Not Working**
- Semua requests di-route ke `app.ts`
- FhyTS router handle semua routing

### 📈 Performance Optimization

#### **Otomatis di Vercel:**
- **Global CDN** - Static assets di-cache globally
- **Automatic Compression** - Gzip compression
- **Edge Locations** - Server response dari lokasi terdekat
- **Serverless Functions** - Auto-scaling

#### **Built-in Optimizations:**
- **TypeScript compilation** - Optimized JavaScript output
- **Asset copying** - Static files tersedia di production
- **Error handling** - Robust error responses

### 🎯 Post-Deployment Checklist

#### **Testing:**
- ✅ Homepage loading (`/`)
- ✅ Advanced calculator (`/calculator`)
- ✅ API endpoints working
- ✅ Static assets (CSS, JS, images) loading
- ✅ Scientific calculator functions
- ✅ Unit converter working
- ✅ History functionality
- ✅ Memory operations

#### **Monitoring:**
- Cek Vercel dashboard untuk analytics
- Monitor function execution times
- Check error logs jika ada issues

### 🚀 Domain Custom (Opsional)

#### **Setup Custom Domain:**
1. Buka Vercel dashboard
2. Pilih project `calculator-fhyts`
3. Go to "Domains" tab
4. Add custom domain
5. Update DNS records sesuai instruksi

---

**Calculator App siap di-deploy dan akan berjalan optimal di Vercel!** 🎉

Untuk pertanyaan atau issues, check dokumentasi di:
- `README.md` - Dokumentasi utama
- `DOKUMENTASI_FHYTS.md` - Framework details
- `CALCULATOR_CONTROLLER_DOCS.md` - Controller documentation
