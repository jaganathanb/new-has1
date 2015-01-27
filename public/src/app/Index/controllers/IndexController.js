define(['utils', 'sns'], function(utils, SocketNamespace) {
    var IndexController = function($rootScope) {
        this.baseSocketNamespace = new SocketNamespace($rootScope);
    };

    return IndexController;
});
