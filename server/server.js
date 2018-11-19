const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3001

var app = express()
var server = http.createServer(app)
var io = socketIO(server)


app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New User connected');

    // socket.emit from Admin text Welcome to chat app
    // socket.brodcast.emit from Admin text new user joined

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the Chat App!',
        createdAt: new Date().getTime()
    })
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined!',
        createdAt: new Date().getTime()
    })

    socket.on('disconnect', () => {
        console.log('server says: user was disconnected')
    })

    socket.on('createMessage', (message) => {
        console.log('New message:', message)
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()

        })
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })
})




// app.get('/', (req, res) => {

//     res.render('index.html')

// } )

server.listen(port, () => {

    console.log(`server is up on port ${port}`)
})