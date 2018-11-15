const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socketIO(server)


app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New User connected');

    socket.emit('newEmail', {
        from: 'aksbhatia@paypal.com',
        text: 'Hey!',
        createAt: 123

    })

    socket.on('createEmail', (newEmail) => {

        console.log('createEmail', newEmail);

    })
    socket.on('disconnect', () => {
        console.log('server says: user was disconnected')
    })

    socket.emit('newMessage', {
        from: 'the server',
        text: 'Meet at 6pm?',
        createdAt: 12121
    })
    socket.on('createMessage', (newMessage) => {
        console.log('New message:', newMessage)
    })
})




// app.get('/', (req, res) => {

//     res.render('index.html')

// } )

server.listen(port, () => {

    console.log(`server is up on port ${port}`)
})