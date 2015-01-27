define(['utils', 'sns'], function(utils, SocketNamespace) {
    var PublicController = function($scope, $rootScope, $location, $route) {
        var that = this;
        this.socketNamespace = {};
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.baseSocketNamespace = this.scope.$parent.index.baseSocketNamespace;
        this.name = $route.current.params.name || 'Anonymus';
        this.isConnected = false;
        this.currentNamespace = $route.current.params.namespace;
        // have to move as config file
        var CONFIG = {
            room: {
                notAvailable: 0,
                houseFull: 1,
                exists: 2
            },
            namespace: {
                exists: 0
            }
        }

        this.baseSocketNamespace.createNamespace({namespace: this.currentNamespace, name: this.name}, function(data) {
            that.isConnected = data.done;
            console.log(data.namespace)
            that.connectToServer();
        });
    };

    PublicController.prototype.connectToServer = function() {
        var that = this;
        this.socketNamespace = new SocketNamespace(this.rootScope);
        this.socketNamespace.connect(3002, this.currentNamespace, function(namespace) {
            console.log('Joined public namespace!');
        });
    };

    PublicController.prototype.createRoom = function(roomName, namespace) {
        var that = this;
        this.show = false;
        this.socketNamespace.createRoom(roomName, function(data) {
            console.log('Room ' + data + ' created !..');
        });
    }

    PublicController.prototype.joinRoom = function(roomName, namespace) {
        this.socketNamespace.joinRoom(roomName, function() {
            console.log('Joined room - ' + roomName);
        });
    }

    PublicController.prototype.leaveRoom = function(roomName, namespace) {
        var that = this;
        this.socketNamespace.leaveRoom(function(data) {
            console.log(data.name + ' left the room!');
        });
    }

    PublicController.prototype.getRooms = function(namespace) {
        this.socketNamespace.getRooms(function(rooms) {
            console.log('Rooms ' + rooms)
        });
    }

    PublicController.prototype.send = function(namespace) {
        var that = this;
        this.socketNamespace.send(this.message);
    };

    PublicController.prototype.receive = function() {
        this.socketNamespace.receive(function(data) {
            console.log(data);
        });
    }

    PublicController.prototype.disConnect = function() {
        this.socketNamespace.disConnect(function() {
            console.log('Disconnected !');
        })
    }

    return PublicController;
});
