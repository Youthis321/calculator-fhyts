<center><img height="150" src="./public/images/icon.png" /></center>

# Calculator App - FhyTS

Aplikasi kalkulator modern yang dibangun menggunakan framework FhyTS dengan desain glass-morphism yang elegan dan fungsionalitas lengkap untuk operasi matematika dasar.

## 🧮 Tentang Calculator App

Calculator App adalah implementasi praktis dari framework FhyTS yang mendemonstrasikan:
- **Arsitektur Modular** - Komponen terorganisir dengan baik
- **TypeScript Integration** - Type safety dan developer experience yang baik
- **Modern UI/UX** - Desain glass-morphism dengan efek blur dan transparansi
- **Responsive Design** - Tampil sempurna di berbagai ukuran layar

## ✨ Fitur Calculator

### Operasi Matematika
- ➕ **Penjumlahan** - Operasi tambah
- ➖ **Pengurangan** - Operasi kurang
- ✖️ **Perkalian** - Operasi kali
- ➗ **Pembagian** - Operasi bagi
- 🔢 **Angka Desimal** - Support untuk bilangan desimal

### Fungsi Kontrol
- **C (Clear)** - Hapus semua input
- **CE (Clear Entry)** - Hapus input terakhir
- **⌫ (Backspace)** - Hapus karakter terakhir
- **= (Equals)** - Hitung hasil

### Keyboard Support
- **Angka 0-9** - Input angka
- **+, -, *, /** - Operasi matematika
- **Enter atau =** - Hitung hasil
- **Escape atau C** - Hapus semua
- **Backspace** - Hapus karakter terakhir

## 🏗️ Ringkasan Framework FhyTS

FhyTS adalah framework web berbasis TypeScript yang ringan, modular, dan fleksibel. Framework ini dirancang dengan arsitektur yang bersih, dukungan dependency injection, middleware, dan routing sederhana yang cocok untuk aplikasi web skala kecil hingga besar.

### Cara Kerja Framework FhyTS

#### 1. **Arsitektur MVC (Model-View-Controller)**
```
├── app/controllers/     → Logika bisnis dan pengendali request
├── app/views/          → Template EJS untuk tampilan
├── app/models/         → Model data dan struktur database
└── app/services/       → Layer service untuk logika aplikasi
```

#### 2. **Routing System**
- **Deklaratif** - Route didefinisikan dalam `app/routes.ts`
- **RESTful** - Support untuk HTTP methods (GET, POST, PUT, DELETE)
- **Middleware Support** - Interceptor untuk request/response

#### 3. **Template Engine (EJS)**
- **Server-Side Rendering** - Template di-render di server
- **Component-Based** - Reusable components dan layouts
- **Data Binding** - Passing data dari controller ke view

#### 4. **Static Assets Management**
- **Public Folder** - CSS, JavaScript, dan gambar
- **Auto-serving** - Assets otomatis tersedia di `/public`
- **Development-friendly** - Hot reload untuk development

#### 5. **TypeScript Integration**
- **Type Safety** - Compile-time error checking
- **IntelliSense** - Auto-completion dan debugging
- **Modern JavaScript** - ES6+ features dengan backward compatibility

### Alur Kerja Framework

1. **Request Masuk** → Server menerima HTTP request
2. **Routing** → Router mencocokkan URL dengan handler
3. **Controller** → Controller memproses logika bisnis
4. **Service Layer** → (Opsional) Memanggil service untuk data processing
5. **View Rendering** → Template EJS di-render dengan data
6. **Response** → HTML atau JSON dikirim ke client

## 🚀 Menjalankan Calculator App

* Node.js v22 or higher
* TypeScript v5 or higher
* A configured tsconfig.json file (recommended)

## 🚀 Menjalankan Calculator App

### Persyaratan Sistem
* Node.js v22 atau lebih tinggi
* TypeScript v5 atau lebih tinggi
* File tsconfig.json yang terkonfigurasi (disarankan)

### Instalasi dan Menjalankan

1. **Clone atau Download Project**
```bash
git clone https://github.com/fitri-hy/calculator-fhyts.git
cd calculator-fhyts
```

2. **Install Dependencies**
```bash
npm install
```

3. **Jalankan Development Server**
```bash
npm run dev
```

4. **Atau Jalankan Production Build**
```bash
npm run build
npm start
```

5. **Buka Browser**
Kunjungi `http://localhost:3000` untuk melihat calculator app

## 🌐 Deploy ke Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fitri-hy/calculator-fhyts)

### Manual Deploy
1. **Push ke GitHub Repository**
2. **Connect di Vercel Dashboard**
3. **Deploy otomatis** - Vercel akan detect konfigurasi

📖 **Panduan lengkap deployment**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 📁 Struktur Folder Calculator App

```
calculator-fhyts/
├── app/
│   ├── controllers/
│   │   └── HomeController.ts     # Controller utama
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.ejs          # Layout utama
│   │   ├── components/
│   │   │   └── calculator.ejs    # Komponen calculator
│   │   └── home.ejs              # Halaman utama
│   └── routes.ts                 # Definisi routing
│
├── config/
│   └── App.Config.json           # Konfigurasi aplikasi
│
├── public/
│   ├── css/
│   │   └── styles.css            # Styling calculator
│   ├── js/
│   │   └── app.js               # Logic calculator
│   └── images/                   # Asset gambar
│
├── app.ts                        # Entry point aplikasi
├── package.json                  # Dependencies dan scripts
├── tsconfig.json                 # Konfigurasi TypeScript
└── README.md                     # Dokumentasi
```

## 🎨 Desain dan Styling

### Glass-morphism Design
- **Backdrop Filter** - Efek blur untuk transparansi modern
- **RGBA Colors** - Warna semi-transparan untuk depth
- **Box Shadow** - Bayangan halus untuk dimensi
- **Border Radius** - Sudut membulat untuk tampilan modern

### Color Scheme
- **Background** - Gambar latar dengan overlay
- **Calculator Body** - Glass container dengan blur effect
- **Number Buttons** - Putih semi-transparan
- **Operator Buttons** - Orange accent color
- **Clear Buttons** - Red warning color

## 🔧 Customization

### Mengubah Tema Warna
Edit file `public/css/styles.css`:
```css
.btn-operator {
  background-color: #your-color; /* Ubah warna operator */
}
```

### Menambah Fungsi Calculator
Edit file `public/js/app.js` untuk menambah operasi matematika lanjutan.

### Mengubah Layout
Edit file `app/views/components/calculator.ejs` untuk mengubah tata letak tombol.

## 📚 Dokumentasi Framework FhyTS

Untuk dokumentasi lengkap framework FhyTS, kunjungi: [https://fhyts.fhylabs.com](https://fhyts.fhylabs.com)

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👨‍💻 Pengembang

- **FhyLabs** - *Framework Developer* - [GitHub](https://github.com/fitri-hy)
- **Calculator App** - *Implementation Example*