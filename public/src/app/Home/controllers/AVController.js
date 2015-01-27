define(['utils', 'sns'], function(utils, SocketNamespace) {
    var AVController = function($rootScope, $location) {
        this.socketNamespace = {};
        this.rootScope = $rootScope;
        this.name = '';
        this.message = '';
        this.currentNamespace = utils.string.trimSlashes($location.path()).split('/')[0] || '';
        
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

    AVController.prototype.addListeners = function() {
        var that = this;

        this.socketNamespace.on("avail-rooms", function(rooms) {
            that.socketNamespace.rooms = rooms;
            console.log(rooms);
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

        this.socketNamespace.on(this.currentNamespace || '/' + '-namespace-created', function(done) {
            that.readyToJoin = done;
            that.isConnected = done;
        })

        this.socketNamespace.on("message", function(message) {
            that.socketNamespace.messages.push(message);
        });
    };

    AVController.prototype.connectToServer = function(name) {
        var that = this;
        this.name = name;
        this.socketNamespace = new SocketNamespace(this.rootScope);
        this.socketNamespace.createNamespace(that.currentNamespace);
        this.addListeners();
    };

    AVController.prototype.createRoom = function(roomName, namespace) {
        var that = this;
        this.show = false;
        var nsSocket = this.socketNamespaces[namespace];
        this.nsSocket.emit('check-room', roomName);

        this.nsSocket.on('room-checked', function(exists) {
            if (exists) {
                // utils.safe(callback)('Room ' + roomName + ' exists');
            } else {
                that.nsSocket.emit('new-room', roomName);
            }
        });
    }

    AVController.prototype.joinRoom = function(roomName, namespace) {
        this.this.socketNamespaces[namespace].emit('join-room', roomName);
    }

    AVController.prototype.leaveRoom = function(roomName, namespace) {
        var that = this;
        this.socketNamespaces[namespace].emit('leave-room', roomName);
    }

    AVController.prototype.getRooms = function(namespace) {
        var that = this;
        this.socketNamespaces[namespace].emit('get-rooms');
    }

    AVController.prototype.send = function(namespace) {
        var that = this;
        this.socketNamespaces[namespace].emit('message', this.message);
    };

    return AVController;
});
