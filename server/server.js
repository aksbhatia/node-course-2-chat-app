const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const {Users} = require('./utils/users.js')

const {generateMessage, generateLocationMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')

const port = process.env.PORT || 3001

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New User connected');

    // socket.emit from Admin text Welcome to chat app
    // socket.brodcast.emit from Admin text new user joined

    socket.on('join', (params, callback) => {

        socket.join(params.room)

        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin','Namaste! Welcome to the Chat App!'))
        
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} joined!`))
    
        callback()

    })

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))

        }
    })

    socket.on('createMessage', (message, callback) => {

        var user = users.getUser(socket.id)

        if(user) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))

        }
        callback()


    })

    socket.on('createLocationMessage', (coords) => {

        var user = users.getUser(socket.id)

        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    })
})





// app.get('/', (req, res) => {

//     res.render('index.html')

// } )

server.listen(port, () => {

    console.log(`server is up on port ${port}`)
})