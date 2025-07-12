import { FhyEngine } from 'fhyts';
import { HomeController } from './controllers/HomeController';

const Use = ((r) => r.rq.bind(r))(FhyEngine.getInstance().r);

export function Route() {
  const Home = new HomeController();
  Use('GET', '/', Home.index.bind(Home));
}
