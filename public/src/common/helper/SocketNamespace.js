define(["socketio", 'utils', 'exception'], function(io, utils, Exception) {
    var SocketNamespace = function(rootScope) {
        this.rootScope = rootScope;
        this.socket = null;
        this.namespace = '/';
        this.rooms = {};
    };

    SocketNamespace.prototype.connect = function(port, namespace, callback) {
        var that = this;
        this.socket = io.connect("localhost:" + port + '/' + (namespace || ''));
        this.socket.on('connect', function(data) {
            that.rootScope.$apply(function() {
                utils.safe(callback)(data);
            });
        });
        this.socket.on('error', function(err) {
            console.log(err);
        });
    }

    SocketNamespace.prototype.createNamespace = function(data, callback) {
        var that = this;
        this.namespace = data.namespace;
        this.socket.emit('create-namespace', data);
        this.socket.on(that.namespace + "namespace-created", function(rooms) {
            that.rootScope.$apply(function() {
                utils.safe(callback)(rooms);
            });
        });
    }

    SocketNamespace.prototype.createRoom = function(roomName, callback) {
        var that = this;
        this.socket.emit('check-room', roomName);

        this.socket.on('room-checked', function(exists) {
            if (exists) {
                utils.safe(callback)(false);
            } else {
                that.socket.emit('new-room', roomName);
                this.socket.on("new-room", function(room) {
                    that.rootScope.$apply(function() {
                        utils.safe(callback)(room);
                    });
                });

            }
        });
    }

    SocketNamespace.prototype.joinRoom = function(roomName, callback) {
        var that = this;
        this.socket.emit('join-room', roomName);
        this.socket.on("new-person", function(person) {
            that.rootScope.$apply(function() {
                utils.safe(callback)(person);
            });
        });
    }

    SocketNamespace.prototype.leaveRoom = function(roomName, callback) {
        var that = this;
        that.socket.emit('leave-room', roomName);
        this.socket.on("left-room", function(person) {
            that.rootScope.$apply(function() {
                utils.safe(callback)(person);
            });
        });
    }

    SocketNamespace.prototype.getRooms = function(callback) {
        this.socket.emit('get-rooms');
        this.socket.on("avail-rooms", function(rooms) {
            that.rootScope.$apply(function() {
                utils.safe(callback)(rooms);
            });
        });
    }

    SocketNamespace.prototype.send = function(message) {
        this.socket.emit('message', {
            message: this.message,
            roomName: this.roomName
        });
    };

    SocketNamespace.prototype.receive = function(callback) {
        this.socket.on("message", function(message) {
            that.rootScope.$apply(function() {
                utils.safe(callback)(message);
            });
        });
    }

    SocketNamespace.prototype.disConnect = function(callback) {
        that.socket.disconnect();
        this.socket.on('disconnected', function(person) {
            that.rootScope.$apply(function() {
                utils.safe(callback)(person);
            });
        });
    }

    // /* methods to be overridden */
    // SocketNamespace.prototype.onRoomCreated = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype.onRoomDestroyed = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype.onNamespaceCreated = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype.onConnectionSuccess = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype.onJoinedRoom = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype.onLeftRoom = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype.onAvailableRooms = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype._onMessage = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }

    // SocketNamespace.prototype.onDisconnect = function(data) {
    //     throw new Exception('You have to override ' + arguments.callee.toString());
    // }


    return SocketNamespace;
});
