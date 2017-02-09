import path from 'path';
let __root = (dir) => path.join(path.dirname(__dirname), dir);
export default {
	port: 8080,
	path: {
		public: __root('public'),
		page: __root('client/pages'),
		layout: __root('server/layout.html')
	},
	router: {
	   routes: './server/routes/',
	   controllers: './server/controllers/'
	},
	host: {
		assets: ''
	},
	debug: true
}
