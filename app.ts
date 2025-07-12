import { FhyEngine, Config, Logger, Static } from 'fhyts';
import { Route } from './app/routes';

async function Server() {
  try {
    Logger.info('Loading config...');
    const config = Config.getInstance();

    Logger.info('Registering routes...');
    Route();

    Logger.info('Registering static folder middleware...');
    const app = FhyEngine.getInstance();
    const staticMiddleware = new Static('./public');
    app.middlewareManager.use(staticMiddleware.handle.bind(staticMiddleware));

    config.load('./config/App.Config.json');
    const port = config.get('port', 3000);

    Logger.info(`Starting server on localhost:${port}`);
    await app.start(port);
  } catch (err) {
    Logger.error('Failed to start:', err);
    process.exit(1);
  }
}

Server();
