module.exports = function(listener) {
    var io = require("socket.io").listen(listener);
    var CONFIG = {
        room: {
            notAvailable: 0,
            houseFull: 1,
            exists: 2
        }
    }

    io.sockets.on('connection', new Handler({
        namespace: '/',
        name: 'admin'
    }));

    function Handler(data) {
        return function(client) {
            var that = this;
            this.people = {};
            this.rooms = {};
            this.name = '';
            this.namespace = data.namespace;
            this.client = client;

            client.removeAllListeners();

            console.log('connected to namespace' + data.namespace);

            that.people[that.client.id] = {
                name: that.name,
                id: client.id
            };

            that.client.on('create-namespace', function(nsData) {
                console.log('creating namespace ' + nsData.namespace);
                var ns = io.of('/' + nsData.namespace);
                that.namespace = nsData.namespace;
                ns.on("connection", new Handler(nsData));
                console.log(nsData.namespace + ' created!..' + ' by ' + nsData.name);
            });

            that.client.on('get-rooms', function() {
                broadcastRooms();
            });

            that.client.on('create-room', function(name, roomName) {
                if (!that.rooms[roomName]) {

                    that.client.join(roomName);

                    that.rooms[roomName] = {
                        name: name,
                        id: 1
                    };

                    that.people[that.client.id] = {
                        name: name,
                        id: that.client.id
                    };

                    that.client.emit('new-room', {
                        type: 'created',
                        user: that.people[that.client.id],
                        room: that.rooms[roomName]
                    });

                } else {
                    that.client.emit('create-room-failed', CONFIG.room.exists);
                }
            });

            that.client.on('join-room', function(name, roomName) {

                that.client.join(roomName);

                that.people[that.client.id] = {
                    name: name,
                    id: that.client.id
                };

                that.client.broadcast.to(roomName).emit('new-person', that.people[that.client.id]);
            })

            that.client.on("message", function(message) {
                console.log('message ' + that.people)
                that.client.emit('message', {
                    type: 'message',
                    user: that.people[that.client.id],
                    message: message
                })
                that.client.broadcast.to(that.roomName).emit("message", {
                    type: 'message',
                    user: that.people[that.client.id],
                    message: message
                });
            });

            that.client.on('leave-room', function() {
                that.client.leave(that.roomName);
                that.client.broadcast.to(that.roomName).emit("left-room", {
                    type: 'left',
                    user: that.people[that.client.id]
                });
            })

            that.client.on("disconnect", function() {
                if (that.people && that.people[that.client.id]) {
                    that.client.broadcast.to(that.roomName).emit("left-room", {
                        type: 'left',
                        user: that.people[that.client.id],
                        message: 'user has left the room'
                    });
                    delete that.people[that.client.id];
                }
                console.log('disconnected ' + that.people[that.client.id] + ' from ' + that.roomName)
            });

            function broadcastRooms() {
                console.log('room calleed');
                that.client.emit('avail-rooms', ((io.nsps[that.namespace] || {}).adapter || {}).rooms);
            }

            that.client.emit(that.namespace + '-namespace-created', {
                done: true,
                namespace: 'data.namespace'
            });
        }
    }
};
