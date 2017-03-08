import path from 'path';
let __root = (dir) => path.join(path.dirname(__dirname), dir);
export default Object.assign(require('../package.json'), {
	port: 8080,
	path: {
		public: __root('public'),
		hash: __root('hash.json'),
		page: __root('client/pages'),
		layout: __root('server/layout.html')
	},
	router: {
	   routes: './server/routes/',
	   controllers: './server/controllers/'
	},
	loginUrls: [
		/^\/user/,
		/^\/article/
	],
	host: {
		assets: ''
	},
});
