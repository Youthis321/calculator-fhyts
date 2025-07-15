# 📖 Dokumentasi Framework FhyTS - Bahasa Indonesia

## 🎯 Ringkasan Framework

**FhyTS** adalah framework web modern berbasis TypeScript yang mengutamakan:
- **Simplicity** - Mudah dipelajari dan digunakan
- **Modularity** - Arsitektur terorganisir dengan baik
- **Performance** - Ringan dan cepat
- **Developer Experience** - TypeScript support penuh

## 🏗️ Cara Kerja Framework FhyTS

### 1. Entry Point (app.ts)
```typescript
// File utama yang memulai aplikasi
import { FhyTS } from 'fhyts';

const app = new FhyTS();
app.start(); // Memulai server
```

### 2. Routing System
Framework menggunakan sistem routing deklaratif di `app/routes.ts`:

```typescript
import { Router } from 'fhyts';
import { HomeController } from './controllers/HomeController';

const router = new Router();

// Definisi route
router.get('/', HomeController.index);
router.post('/calculate', HomeController.calculate);

export default router;
```

**Alur Routing:**
1. **Request masuk** → Server menerima HTTP request
2. **Route matching** → Framework mencocokkan URL dengan route
3. **Controller execution** → Method controller dipanggil
4. **Response** → Controller mengembalikan response

### 3. Controller Pattern
Controller mengatur logika bisnis dan komunikasi antara view dan model:

```typescript
export class HomeController {
  static async index(req: Request, res: Response) {
    // Logic untuk halaman utama
    const data = { title: 'Calculator App' };
    return res.render('home', data);
  }
  
  static async calculate(req: Request, res: Response) {
    // Logic untuk kalkulasi
    const { expression } = req.body;
    const result = eval(expression); // Simplified
    return res.json({ result });
  }
}
```

### 4. View Engine (EJS)
Framework menggunakan EJS untuk template rendering:

**Layout System:**
```
app/views/
├── layouts/
│   └── main.ejs          # Layout utama
├── components/
│   └── calculator.ejs    # Komponen calculator
└── home.ejs              # Halaman utama
```

**Template Inheritance:**
```html
<!-- layouts/main.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <%- body %>
  <script src="/js/app.js"></script>
</body>
</html>
```

### 5. Static Assets
Framework otomatis melayani file statis dari folder `public/`:

```
public/
├── css/        # Stylesheet
├── js/         # JavaScript files
├── images/     # Gambar dan assets
└── fonts/      # Font files (opsional)
```

**Auto-serving:** File di `public/css/styles.css` tersedia di `/css/styles.css`

## 🔄 Lifecycle Request-Response

### 1. Request Lifecycle
```
HTTP Request → Router → Middleware → Controller → Service → Response
```

**Detail Alur:**
1. **Client** mengirim HTTP request
2. **Router** mencocokkan URL dengan route handler
3. **Middleware** (jika ada) memproses request
4. **Controller** menjalankan business logic
5. **Service** (opsional) mengolah data
6. **View** di-render dengan data
7. **Response** dikirim ke client

### 2. Data Flow
```
Model ↔ Service ↔ Controller ↔ View → Client
```

## 🎨 Arsitektur Calculator App

### Komponen Utama

#### 1. Frontend (Client-side)
- **HTML Structure** - Layout calculator di `calculator.ejs`
- **CSS Styling** - Glass-morphism design di `styles.css`
- **JavaScript Logic** - Operasi calculator di `app.js`

#### 2. Backend (Server-side)
- **Server** - Express.js dengan TypeScript
- **Routing** - Route management
- **Template Engine** - EJS untuk rendering

### Data Flow Calculator
```
User Input → JavaScript → DOM Update → Display Result
     ↓
Button Click → appendToDisplay() → Update Display
     ↓
Calculate → evaluate() → Show Result/Error
```

## 🚀 Optimizations & Best Practices

### 1. TypeScript Benefits
- **Type Safety** - Compile-time error detection
- **IntelliSense** - Auto-completion dan documentation
- **Refactoring** - Safe code restructuring

### 2. Performance
- **Static Assets** - Efficient serving dengan Express
- **Template Caching** - EJS template caching
- **Minification** - CSS/JS minification untuk production

### 3. Development Workflow
```bash
npm run dev     # Development dengan hot reload
npm run build   # Build untuk production
npm start       # Jalankan production server
```

## 🔧 Configuration

### App.Config.json
```json
{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "view": {
    "engine": "ejs",
    "directory": "app/views"
  },
  "static": {
    "directory": "public"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 🎯 Calculator App Implementation

### 1. Calculator Logic
```javascript
// Fungsi utama calculator
function calculate() {
  try {
    let result = Function('"use strict"; return (' + display + ')')();
    display = result.toString();
    updateDisplay();
  } catch (error) {
    showError();
  }
}
```

### 2. UI Components
- **Display** - Input field untuk menampilkan angka
- **Number Buttons** - Tombol 0-9 untuk input
- **Operator Buttons** - +, -, ×, ÷ untuk operasi
- **Function Buttons** - C, CE, ⌫, = untuk kontrol

### 3. Event Handling
- **Click Events** - Tombol calculator
- **Keyboard Events** - Keyboard shortcuts
- **Error Handling** - Invalid operations

## 🎨 Styling Architecture

### Glass-morphism Implementation
```css
.glass-container {
  background: rgba(255, 255, 255, 0.1);    /* Semi-transparent */
  backdrop-filter: blur(15px);              /* Blur effect */
  border-radius: 15px;                      /* Rounded corners */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); /* Shadow depth */
}
```

### Responsive Grid
```css
.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);    /* 4 kolom sama rata */
  gap: 10px;                                /* Spacing antar tombol */
}
```

## 📈 Future Enhancements

### Fitur yang Bisa Ditambahkan
1. **Scientific Calculator** - Sin, cos, tan, log, dll
2. **History** - Menyimpan riwayat kalkulasi
3. **Memory Functions** - M+, M-, MR, MC
4. **Theme Switcher** - Multiple color themes
5. **Unit Converter** - Currency, length, weight, dll

### Technical Improvements
1. **PWA Support** - Offline functionality
2. **Database Integration** - Simpan history di database
3. **API Endpoints** - RESTful API untuk calculator
4. **Testing** - Unit tests dan integration tests
5. **Deployment** - Docker containerization

---

*Dokumentasi ini memberikan pemahaman mendalam tentang cara kerja framework FhyTS dan implementasi Calculator App. Untuk pertanyaan lebih lanjut, silakan kunjungi dokumentasi resmi atau buat issue di repository.*
