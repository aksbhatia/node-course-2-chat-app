var socket = io()

socket.on('connect', function()  {
    console.log('connected to server')
})
socket.on('disconnect', function() {
    console.log('disconnected from server')
})


socket.on('newMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#message-template').html()
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })

    jQuery('#messages').append(html)
})

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')

    var template = jQuery('#location-message-template').html()
    // var a = jQuery('#location-message-template-link').html()
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    })
    // a.attr('href')
    jQuery('#messages').append(html)


    // var li = jQuery('<li></li>')
    // var a = jQuery('<a target="_blank">My Current Location</a>')
    // li.text(`${message.from}  ${formattedTime}: `)
    // a.attr('href', message.url)
    // li.append(a)
    // jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault()

    var messageTextbox = jQuery('[name=message]')

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {
        jQuery(messageTextbox.val(''))

    })
})

var locationButton = jQuery('#send-location')
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...')


    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send Location')
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        locationButton.removeAttr('disabled').text('Send Location')

        alert('Unable to fetch location')
    })
})