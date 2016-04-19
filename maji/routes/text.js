var express = require('express');
var router = express.Router();
var googleMapsKey = "AIzaSyCnNV7W3U8Ge4AXiWPIrmhWZmOlClHaOo0";
var httpAdapter = 'https';
var models = require('../models/cereal.js');

var geocoderProvider = 'google';
var extra = {
    apiKey: googleMapsKey,
    formatter: null       
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
var twilio = require('../config/twilio.js').twilio;
var twilio_number = require('../config/twilio.js').number;

module.exports = function(router){
    router.get('/texts/test', function(req, res, next){
        res.render('texts/test');
    });

    router.post('/texts/test', function(req, res, next){
        var message = req.body;
        console.log(message.device_number);
        twilio.messages.create({ 
            to: message.device_number, 
            from: twilio_number, 
            body: message.Body,   
        }, function(err, message) { 
            if(err){
                console.log(err);    
                res.send("uh oh");
            } else{
                console.log(message.sid); 
                res.redirect("/admins");
            }
        });
    });


    //TEXT MESSAGE FUNCTIONALITY
    router.get('/texts', function(req, res, next){
            if(!req.query.From){
                res.render("texts/textus");   
            } else { 
                var sender = req.query.From;
                var info = req.query.Body;
                res.status(200);
                res.set('Content-Type', 'text/xml');

                models.Device.findAll({
                    where: {
                        phone_number: sender.split("+1")[1],
                    }
                }).then(function(devices){
                    if(devices == null || devices.length == 0){
                        geocoder.geocode(info, function(err, location){
                            var x = location[0];
                            var y = location[1];
                        });
                        message = "<Message>hi user</Message>";
                        res.send('<Response>'+message+'</Response>');
                    } else if(devices.length > 1){  
                        res.send('<Response><Message>Device duplicate error.</Message></Response>');
                    } else {
                        //water (1 or 0), pH, turbidity, temperature
                        var results = info.split(",");
                        var test_results = [];
                        for (r in results) {
                            var result = {};
                            result.result = results[r];
                            result.test_id = r;
                            result.device_id = devices[0].id;
                            test_results.push(result);
                        }
                        models.TestResult.bulkCreate(test_results).then(function(result){
                                res.send('<Response></Response>');
                        });
                        console.log(test_results);
                    }
                });
            }
        });
}
