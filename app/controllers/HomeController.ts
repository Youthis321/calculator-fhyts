import { Controller, Request, Response, Views } from 'fhyts';

export class HomeController extends Controller {
  private views = new Views();

  async index(req: Request, res: Response) {
    const page = this.views.render('home', { 
	  title: 'FhyTS' 
	});
    return res.status(200).html(page);
  }
}
