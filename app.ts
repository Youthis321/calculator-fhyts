import { FhyEngine, Config, Logger, Static } from 'fhyts';
import { Route } from './app/routes';
import * as path from 'path';
import * as fs from 'fs';

let app: FhyEngine | null = null;

async function initializeApp() {
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
    const staticMiddleware = new Static('./public');
    app.middlewareManager.use(staticMiddleware.handle.bind(staticMiddleware));
    
    Logger.info('App initialized');
    return app;
  } catch (err) {
    Logger.error('Failed to initialize:', err);
    throw err;
  }
}

async function Server() {
  try {
    const appInstance = await initializeApp();
    const config = Config.getInstance();
    const port = config.get('port', 3000);

    Logger.info(`Starting server on localhost:${port}`);
    await appInstance.start(port);
  } catch (err) {
    Logger.error('Failed to start:', err);
    process.exit(1);
  }
}

// For Vercel serverless deployment
export default async function handler(req: any, res: any) {
  try {
    const appInstance = await initializeApp();
    
    // Handle the request through FhyTS router
    const router = appInstance.r;
    await router.handle(req, res);
    
  } catch (error) {
    Logger.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// For local development
if (require.main === module) {
  Server();
}
