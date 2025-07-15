import { FhyEngine } from 'fhyts';
import { HomeController } from './controllers/HomeController';
import { CalculatorController } from './controllers/CalculatorController';

const Use = ((r) => r.rq.bind(r))(FhyEngine.getInstance().r);

export function Route() {
  const Home = new HomeController();
  const Calculator = new CalculatorController();
  
  // Home routes
  Use('GET', '/', Home.index.bind(Home));
  
  // Calculator API routes
  Use('POST', '/api/calculate', Calculator.calculate.bind(Calculator));
  Use('POST', '/api/scientific', Calculator.scientific.bind(Calculator));
  Use('POST', '/api/memory', Calculator.memory.bind(Calculator));
  Use('GET', '/api/history', Calculator.history.bind(Calculator));
  Use('DELETE', '/api/history', Calculator.clearHistory.bind(Calculator));
  Use('POST', '/api/convert', Calculator.convert.bind(Calculator));
  
  // Calculator page route
  Use('GET', '/calculator', Calculator.index.bind(Calculator));
}
