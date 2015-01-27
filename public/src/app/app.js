define(function(require) {

	// Configure RequireJS config
	window.require.config({
		paths: {
			"utils": "common/helper/utils",
			"angular": "bower_components/angularjs/angular",
			"angular-route": "bower_components/angularjs/angular-route",
			"Route": "common/helper/Route",
			"routes": "common/routes/routes",
			"socketio": '/socket.io/socket.io.js',
			"sns": 'common/helper/SocketNamespace',
			'exception':'common/helper/Exception'
		},
		shim: {
			'angular': {
				exports: 'angular'
			},
			'angular-route': ['angular']
		},
		urlArgs: '0.0.1'
	});

	// Load dependencies
	require(['Route', 'angular', 'angular-route', 'utils', 'routes', 
		'main/app/index/controllers/IndexController.js', 
		'main/app/applicationbar/controllers/ApplicationBarController.js'], function(Route, angular, ngRoute, utils, routes, IndexController, ApplicationBarController) {
		// Create the main 'app' AngularJS module
		var app = angular.module('app', ['ngRoute']);

		// Configure the 'app' module
		app.config(function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
			var routeHelper = new Route($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide);
			routeHelper.registerRoutes(routes);
		});

		app.controller('ApplicationBarController', ApplicationBarController);
		app.controller('IndexController', IndexController);

		// We're good to go, bootstrap AngularJS!
		angular.bootstrap(document, ['app']);
	});
});