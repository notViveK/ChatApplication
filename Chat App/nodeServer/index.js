// Node Server to handle Socket io connections

const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});

const users = {}
const namedata = {}
// let c=0;

io.on('connection', socket => {
    socket.on('new-user-joined', username => {
        console.log("New user", username)
        // console.log(socket.id)
        users[socket.id] = username;
        namedata[username] = socket.id;
        console.log("new userid", namedata[username]);
        socket.broadcast.emit('user-joined', username);
    });
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, username: users[socket.id] })
    });
    socket.on('multi-message', message => {
        let first = (message).substring(1, (message).indexOf(' '));
        console.log("first name is", first);
        let array=first.split(",");
        // console.log(array[0]);
        // console.log(array[1]);
        for(let i=0;i<array.length;i++){
            console.log(array[i]);
            socket.broadcast.to(namedata[array[i]]).emit('multi', { message: message, username: users[socket.id] })
        }
        
    });
    socket.on('personal-message', message => {
        let first = (message).substring(1, (message).indexOf(' '));
        console.log("first name is", first);
        socket.broadcast.to(namedata[first]).emit('personal', { message: message, username: users[socket.id] })
    });

    socket.on('image', message => {

        socket.broadcast.emit('img', message);
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
