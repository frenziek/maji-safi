var twilio_number = "+17813254725";

//test creds
//var accountSid = 'AC74a25c39ba58c0b81f67d6504c0f0eed'; 
//var authToken = 'c9d73afc6b77cdec51431bfde8245b82'; 
//live creds
var accountSid = 'AC5c6190a7f3e77af507fe032caee15cf9';
var authToken = '5653c3e61293576839a0f6770eb003f9';
//require the Twilio module and create a REST client 
var twilio = require('twilio')(accountSid, authToken); 


exports.number = twilio_number;
exports.twilio = twilio;