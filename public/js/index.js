var socket = io()

socket.on('connect', function()  {
    console.log('connected to server')
    socket.emit('createMessage', {
        from: 'client',
        text: 'sure. works for me'
    })
})
socket.on('disconnect', function() {
    console.log('disconnected from server')
})


socket.on('newMessage', function(message) {
    console.log('new message from server:', message )
})