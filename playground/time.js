// Jan 1st 1970 00:00:00 am (UTC)

// const moment = require('moment')

// var date = new Date()

// var date = moment()
// date.add(1, 'years').subtract(9, 'months')

// console.log(date.format('Do MMM, YYYY'))




const moment = require('moment')

var createdAt = 1234
var date = new moment(createdAt)

var someTimestamp = moment().valueOf()
console.log(someTimestamp)

console.log('current time', date.format('h:mm a'))