var twilio_number = process.env.TWILIO_NUMBER;
var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
//require the Twilio module and create a REST client 
var twilio = require('twilio')(accountSid, authToken); 


exports.number = twilio_number;
exports.twilio = twilio;