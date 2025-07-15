import { FhyEngine, Config, Logger, Static } from 'fhyts';
import { Route } from '../app/routes';
import path from 'path';
import fs from 'fs';

let app: FhyEngine | null = null;

const initializeApp = async (): Promise<FhyEngine> => {
  if (app) return app;
  
  try {
    Logger.info('Loading config...');
    const config = Config.getInstance();
    
    // Check if config file exists (for local development)
    const configPath = './config/App.Config.json';
    const configExists = fs.existsSync(configPath);
    
    if (configExists) {
      config.load(configPath);
      Logger.info('Config loaded from file');
    } else {
      // For serverless deployment, use environment variables
      Logger.info('Using environment config for serverless deployment');
      // Config will use defaults when no file is loaded
    }

    Logger.info('Registering routes...');
    Route();

    Logger.info('Registering static folder middleware...');
    app = FhyEngine.getInstance();
    
    // Use absolute path for static files in serverless environment
    const publicPath = path.join(process.cwd(), 'public');
    Logger.info(`Static files path: ${publicPath}`);
    
    const staticMiddleware = new Static(publicPath);
    app.middlewareManager.use(staticMiddleware.handle.bind(staticMiddleware));
    
    Logger.info('App initialized');
    return app;
  } catch (err) {
    Logger.error('Failed to initialize:', err);
    throw err;
  }
};

export default async function handler(req: any, res: any) {
  try {
    Logger.info(`Incoming request: ${req.method} ${req.url}`);
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Handle static files first
    const url = req.url || '/';
    if (url.startsWith('/css/') || url.startsWith('/js/') || url.startsWith('/images/') || url.startsWith('/public/')) {
      res.status(404).json({ error: 'Static file not found' });
      return;
    }
    
    // For root path, serve home page directly
    if (url === '/' || url === '') {
      // Instead of using HomeController, serve HTML directly
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Calculator FhyTS - Advanced Scientific Calculator</title>
            <link rel="stylesheet" href="/css/styles.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <header class="header">
                    <div class="logo">
                        <img src="/images/logo.png" alt="Calculator Logo" class="logo-img">
                        <h1>Calculator FhyTS</h1>
                    </div>
                    <p class="subtitle">Kalkulator Ilmiah Canggih dengan Konverter Unit</p>
                </header>

                <main class="main-content">
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🧮</div>
                            <h3>Kalkulator Dasar</h3>
                            <p>Operasi matematika dasar dengan antarmuka yang mudah digunakan</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">🔬</div>
                            <h3>Mode Ilmiah</h3>
                            <p>Fungsi trigonometri, logaritma, faktorial, dan operasi matematika lanjutan</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">🔄</div>
                            <h3>Konverter Unit</h3>
                            <p>Konversi panjang, berat, suhu, luas, dan volume dengan mudah</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">💾</div>
                            <h3>Fungsi Memori</h3>
                            <p>M+, M-, MR, MC untuk menyimpan dan mengelola hasil perhitungan</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">📝</div>
                            <h3>Riwayat Perhitungan</h3>
                            <p>Simpan dan tinjau kembali perhitungan sebelumnya</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">⌨️</div>
                            <h3>Dukungan Keyboard</h3>
                            <p>Input cepat menggunakan keyboard untuk produktivitas maksimal</p>
                        </div>
                    </div>

                    <div class="cta-section">
                        <button onclick="window.location.href='/calculator'" class="cta-button">
                            Buka Kalkulator
                        </button>
                        <p class="cta-text">Mulai menghitung dengan fitur-fitur canggih sekarang!</p>
                    </div>
                </main>

                <footer class="footer">
                    <p>&copy; 2025 Calculator FhyTS. Dibangun dengan TypeScript dan FhyTS Framework.</p>
                </footer>
            </div>

            <script src="/js/app.js"></script>
        </body>
        </html>
      `);
      return;
    }
    
    // For calculator page, serve calculator HTML directly
    if (url === '/calculator') {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Calculator - FhyTS</title>
            <link rel="stylesheet" href="/css/styles.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <header class="header">
                    <div class="logo">
                        <img src="/images/logo.png" alt="Calculator Logo" class="logo-img">
                        <h1>Calculator FhyTS</h1>
                    </div>
                    <nav class="nav">
                        <a href="/" class="nav-link">Home</a>
                        <a href="/calculator" class="nav-link active">Calculator</a>
                    </nav>
                </header>

                <main class="calculator-container">
                    <div class="calculator-modes">
                        <button class="mode-btn active" data-mode="basic">Basic</button>
                        <button class="mode-btn" data-mode="scientific">Scientific</button>
                        <button class="mode-btn" data-mode="converter">Converter</button>
                        <button class="mode-btn" data-mode="history">History</button>
                    </div>

                    <div class="calculator-wrapper">
                        <!-- Basic Calculator -->
                        <div id="basic-calculator" class="calculator-mode active">
                            <div class="calculator">
                                <div class="display">
                                    <input type="text" id="display" readonly value="0">
                                </div>
                                <div class="buttons">
                                    <button class="btn clear" onclick="clearDisplay()">C</button>
                                    <button class="btn clear" onclick="clearEntry()">CE</button>
                                    <button class="btn operator" onclick="appendToDisplay('/')">&divide;</button>
                                    <button class="btn operator" onclick="appendToDisplay('*')">&times;</button>
                                    
                                    <button class="btn number" onclick="appendToDisplay('7')">7</button>
                                    <button class="btn number" onclick="appendToDisplay('8')">8</button>
                                    <button class="btn number" onclick="appendToDisplay('9')">9</button>
                                    <button class="btn operator" onclick="appendToDisplay('-')">-</button>
                                    
                                    <button class="btn number" onclick="appendToDisplay('4')">4</button>
                                    <button class="btn number" onclick="appendToDisplay('5')">5</button>
                                    <button class="btn number" onclick="appendToDisplay('6')">6</button>
                                    <button class="btn operator" onclick="appendToDisplay('+')">+</button>
                                    
                                    <button class="btn number" onclick="appendToDisplay('1')">1</button>
                                    <button class="btn number" onclick="appendToDisplay('2')">2</button>
                                    <button class="btn number" onclick="appendToDisplay('3')">3</button>
                                    <button class="btn equals" onclick="calculate()" rowspan="2">=</button>
                                    
                                    <button class="btn number zero" onclick="appendToDisplay('0')">0</button>
                                    <button class="btn number" onclick="appendToDisplay('.')">.</button>
                                </div>
                            </div>
                        </div>

                        <!-- Scientific Calculator -->
                        <div id="scientific-calculator" class="calculator-mode">
                            <div class="calculator scientific">
                                <div class="display">
                                    <input type="text" id="sci-display" readonly value="0">
                                </div>
                                <div class="scientific-functions">
                                    <button class="btn function" onclick="scientificFunction('sin')">sin</button>
                                    <button class="btn function" onclick="scientificFunction('cos')">cos</button>
                                    <button class="btn function" onclick="scientificFunction('tan')">tan</button>
                                    <button class="btn function" onclick="scientificFunction('log')">log</button>
                                    <button class="btn function" onclick="scientificFunction('ln')">ln</button>
                                    <button class="btn function" onclick="scientificFunction('sqrt')">√</button>
                                    <button class="btn function" onclick="scientificFunction('factorial')">n!</button>
                                    <button class="btn function" onclick="scientificFunction('power')">x^y</button>
                                </div>
                            </div>
                        </div>

                        <!-- Unit Converter -->
                        <div id="converter" class="calculator-mode">
                            <div class="converter-container">
                                <h3>Konverter Unit</h3>
                                <div class="converter-form">
                                    <select id="converter-type">
                                        <option value="length">Panjang</option>
                                        <option value="weight">Berat</option>
                                        <option value="temperature">Suhu</option>
                                        <option value="area">Luas</option>
                                        <option value="volume">Volume</option>
                                    </select>
                                    <input type="number" id="converter-input" placeholder="Masukkan nilai">
                                    <select id="from-unit"></select>
                                    <span>ke</span>
                                    <select id="to-unit"></select>
                                    <button onclick="convertUnit()">Konversi</button>
                                    <div id="converter-result"></div>
                                </div>
                            </div>
                        </div>

                        <!-- History -->
                        <div id="history" class="calculator-mode">
                            <div class="history-container">
                                <h3>Riwayat Perhitungan</h3>
                                <button onclick="clearHistory()" class="clear-history-btn">Hapus Riwayat</button>
                                <div id="history-list"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Memory Functions -->
                    <div class="memory-functions">
                        <button class="memory-btn" onclick="memoryFunction('MC')">MC</button>
                        <button class="memory-btn" onclick="memoryFunction('MR')">MR</button>
                        <button class="memory-btn" onclick="memoryFunction('M+')">M+</button>
                        <button class="memory-btn" onclick="memoryFunction('M-')">M-</button>
                    </div>
                </main>

                <footer class="footer">
                    <p>&copy; 2025 Calculator FhyTS. Advanced Scientific Calculator.</p>
                </footer>
            </div>

            <script src="/js/app.js"></script>
        </body>
        </html>
      `);
      return;
    }
    
    const appInstance = await initializeApp();
    const router = appInstance.r;
    
    if (!router) {
      Logger.error('Router not found');
      res.status(500).json({ error: 'Router not initialized' });
      return;
    }
    
    Logger.info('Calling router.handle...');
    await router.handle(req, res);
    Logger.info('Router.handle completed');
    
  } catch (error) {
    Logger.error('Handler error:', error);
    Logger.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Ensure response is sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : '') : undefined
      });
    }
  }
}
