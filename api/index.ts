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
      const HomeController = require('../app/controllers/HomeController').HomeController;
      const home = new HomeController();
      
      // Create a mock request/response object that FhyTS expects
      const mockReq = {
        req: req,
        params: {},
        parseBody: async () => req.body || {},
        getHeader: (name: string) => req.headers[name?.toLowerCase()],
        rawReq: req
      };
      
      const mockRes = {
        res: res,
        json: (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify(data));
        },
        send: (data: any) => {
          res.status(200).send(data);
        },
        render: (view: string, data: any) => {
          // For now, just return a simple HTML response
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Calculator App</title>
              <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
              <h1>Calculator App</h1>
              <p>Welcome to the advanced calculator application!</p>
              <a href="/calculator">Go to Calculator</a>
              <script src="/js/app.js"></script>
            </body>
            </html>
          `);
        }
      };
      
      await home.index(mockReq, mockRes);
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
