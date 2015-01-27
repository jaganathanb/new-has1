define(['utils'], function(utils) {
    function getFileNameFromPath(path, trimFileExtension) {
        var parts = path.split('/');
        var filename = parts[parts.length - 1];

        if (trimFileExtension) {
            return filename.split('.')[0];
        } else {
            return filename;
        }
    }

    function getControllerNameFromFilePath(path) {
        var filename = getFileNameFromPath(path, true);

        return utils.string.capitalize(filename);
    }

    function getDirectiveNameFromFilePath(path) {
        var filename = getFileNameFromPath(path, true);
        var parts = filename.split('-');
        var directiveName = parts[0].toLowerCase();
        for (var i = 1; i < parts.length; i++) {
            directiveName += utils.string.capitalize(parts[i]);
        }

        return directiveName;
    }

    function getServiceNameFromFilePath(path) {
        var filename = getFileNameFromPath(path, true);

        return utils.string.capitalize(filename);
    }

    /**
        Initializes an instance of the Route
    */
    var Route = function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
        this.routeProvider = $routeProvider;
        this.controllerProvider = $controllerProvider;
        this.compileProvider = $compileProvider;
        this.filterProvider = $filterProvider;
        this.provide = $provide;

        /**
            A list of registered controllers so we only register them once
        */
        this.registeredControllers = [];

        /**
            A list of registered directives so we only register them once
        */
        this.registeredDirectives = [];

        /**
            A list of registered services so we only register them once
        */
        this.registeredServices = [];
    };

    /**
           Helper method for loading dependencies on the fly using $routeProvider's resolve
           @param {object} $q AngularJS service for working with javascript promises
           @param {object} $rootScope AngularJS service for working with routing
           @param {array} dependencies A list of dependencies to load for the current route
       */
    Route.prototype.loadDependencies = function($q, $rootScope, dependencies) {
        var deferred = $q.defer();

        var self = this;
        require(dependencies, function() {
            // register the loaded dependencies with AngularJS if they haven't been registered already
            for (var i = 0; i < (dependencies || {}).length; i++) {
                var path = dependencies[i];
                if (utils.string.contains(path, '/controllers/')) {
                    // register controllers
                    var name = getControllerNameFromFilePath(path);
                    if (!self.registeredControllers[name]) {
                        self.controllerProvider.register(getControllerNameFromFilePath(path), arguments[i]);
                        self.registeredControllers[name] = true;
                    }
                } else if (utils.string.contains(path, '/directives/')) {
                    // register directives
                    var name = getDirectiveNameFromFilePath(path);
                    if (!self.registeredDirectives[name]) {
                        self.compileProvider.directive(getDirectiveNameFromFilePath(path), arguments[i]);
                        self.registeredDirectives[name] = true;
                    }
                } else if (utils.string.contains(path, '/services/')) {
                    // register services
                    var name = getDirectiveNameFromFilePath(path);
                    if (!self.registeredServices[name]) {
                        self.provide.service(getServiceNameFromFilePath(path), arguments[i]);
                        self.registeredServices[name] = true;
                    }
                };
            }

            // all dependencies have now been loaded by requirejs, so resolve the promise
            $rootScope.$apply(function() {
                deferred.resolve();
            });
        });

        return deferred.promise;
    };

    /**
        Registers the routes with the routeProvider
        @param {array} routes The routes to register
    */
    Route.prototype.registerRoutes = function(routes) {
        var self = this;

        routes.forEach(function(route) {
            self.routeProvider.when(route.when, {
                templateUrl: route.templateUrl,
                resolve: {
                    load: function($q, $route, $rootScope) {
                        if (route.loadControllerFromPath) {
                            for (var i = 0; i < route.requires.length; i++) {
                                if (!utils.string.contains(route.requires[i], 'main/app/home/controllers/'+ utils.string.capitalize($route.current.pathParams.namespace) + 'Controller.js')) {
                                    route.requires.push('main/app/home/controllers/'+ utils.string.capitalize($route.current.pathParams.namespace) + 'Controller.js')
                                };
                            };
                        };
                        return self.loadDependencies($q, $rootScope, route.requires);
                    }
                }
            });
        });

        self.routeProvider.otherwise({
            templateUrl: 'public/404.html',
            url: '/*'
        });
    };

    return Route;
});
