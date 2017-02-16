import config from 'config';
import Controller from '../controller';

export default class ShowController extends Controller {
	*index(){
		this.render('pages/winter', {});
	}
}
