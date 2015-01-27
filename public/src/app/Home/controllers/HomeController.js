define(['utils', 'sns'], function(utils, SocketNamespace) {

    var HomeController = function($scope, $rootScope, $location) {
        this.socketNamespace = {};
        this.rootScope = $rootScope;
        this.scope = $scope;
        this.locationService = $location;
        this.name = '';
        this.title = 'T-Collab';
        this.message = '';
        this.formLabel = 'People call me as, ';
        this.readyToJoin = false;
        this.isConnected = true;
        this.messageStatus = false;
        this.currentNamespace = utils.string.trimSlashes($location.path()).split('/')[0] || '/';
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
    };

    HomeController.prototype.addListeners = function() {
        var that = this;

        this.socketNamespace.on("avail-rooms", function(rooms) {
            that.socketNamespace.rooms = rooms;
            console.log(rooms + 'avail rooms');
        });

        this.socketNamespace.on("new-room", function(room) {
            that.socketNamespace.rooms.push(room);
            that.socketNamespace.messages.push('New room ' + room.name + ' is available!');
        });

        this.socketNamespace.on("room-removed", function(roomToRemove) {
            utils.array.remove(socketNamespace.rooms, function(room) {
                return roomToRemove.name === room.name;
            });
        });

        this.socketNamespace.on("new-person", function(person) {
            that.socketNamespace.people.push(person);
            that.socketNamespace.messages.push(person.name + ' joined the room!');
        });

        this.socketNamespace.on("left-room", function(personLeft) {
            utils.array.remove(socketNamespace.people, function(person) {
                return personLeft.id === person.id;
            });
            that.socketNamespace.messages.push(person.name + ' left the room!');
        });

        this.socketNamespace.on('join-room-failed', function(code) {
            switch (code) {
                case CONFIG.room.houseFull:
                    console.log('Room is full!');
                default:
                    console.log('!!');
            }
        });

        this.socketNamespace.on('create-room-failed', function(code) {
            switch (code) {
                case CONFIG.room.exists:
                    console.log('Room is already exists!');
                default:
                    console.log('!!');
            }
        });

        this.socketNamespace.on(this.currentNamespace + '-namespace-created', function(data) {
            that.readyToJoin = data.done;
            that.isConnected = data.done;
            that.locationService.path('/public/'+that.name);
        })

        this.socketNamespace.on("message", function(message) {
            that.socketNamespace.messages.push(message);
        });
    };

    HomeController.prototype.connectToServer = function() {
        var that = this;
        this.socketNamespace = this.scope.$parent.index.baseSocketNamespace;
        this.socketNamespace.connect(3002, '', function (namespace) {
            that.locationService.path('/public/' + that.name);
            //that.getRooms();
        });
    };

    HomeController.prototype.createRoom = function(roomName, namespace) {
        var that = this;
        this.show = false;
        this.socketNamespace.createRoom(roomName, function (data) {
            console.log('Room ' + data + ' created !..');
        });
    }

    HomeController.prototype.joinRoom = function(roomName, namespace) {
        this.socketNamespace.joinRoom(roomName, function () {
            console.log('Joined room - ' + roomName);
        });
    }

    HomeController.prototype.leaveRoom = function(roomName, namespace) {
        var that = this;
        this.socketNamespace.leaveRoom(function (data) {
            console.log(data.name +' left the room!');
        });
    }

    HomeController.prototype.getRooms = function(namespace) {
        this.socketNamespace.getRooms(function (rooms) {
            console.log('Rooms '+ rooms)
        });
    }

    HomeController.prototype.send = function(namespace) {
        var that = this;
        this.socketNamespace.send(this.message);
    };

    HomeController.prototype.receive = function () {
        this.socketNamespace.receive(function (data) {
            console.log(data);
        });
    }

    HomeController.prototype.disConnect = function () {
        this.socketNamespace.disConnect(function () {
            console.log('Disconnected !');
        })
    }

    return HomeController;
});
