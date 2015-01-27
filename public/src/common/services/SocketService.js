define(['socketNamespace', 'utils'], function(SocketNamespace, utils) {
    var SocketService = function($rootScope) {
        this.socket = new SocketNamespace();
        this.socketNamespace = new SocketNamespace();
    };

    return SocketService;
});
