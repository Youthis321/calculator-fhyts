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
    const staticMiddleware = new Static('./public');
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
