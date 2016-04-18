var express = require('express');
var router = express.Router();
var googleMapsKey = "AIzaSyCnNV7W3U8Ge4AXiWPIrmhWZmOlClHaOo0";
var httpAdapter = 'https';

var geocoderProvider = 'google';
var extra = {
    apiKey: googleMapsKey,
    formatter: null       
};
var twilio_number = "+17813254725";
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
//test creds
//var accountSid = 'AC74a25c39ba58c0b81f67d6504c0f0eed'; 
//var authToken = 'c9d73afc6b77cdec51431bfde8245b82'; 
//live creds
var accountSid = 'AC5c6190a7f3e77af507fe032caee15cf9';
var authToken = '5653c3e61293576839a0f6770eb003f9';
//require the Twilio module and create a REST client 
var twilio = require('twilio')(accountSid, authToken); 

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
    router.post('/texts/', function(req, res, next){
        console.log('hit');
        var sender = req.body.From;
        var info = req.body.Body;
        res.set('Content-Type', 'text/xml');
        res.send('<Response></Response>');


        /*models.Device.findAll({
            where: {
                phone_number: sender.split("+1")[1],
            }
        }).then(function(devices){
            if(devices == null || devices.length == 0){
    /*             geocoder.geocode(info, function(err, location){
    //                 models.Device.findAll({
    //                     where:{
    //                         locationx:{
    //                             $gt: location[0].latitude -1,
    //                             $lt: location[0].latitude +1
    //                         },
    //                         locationy:{
    //                             $gt: location[0].longitude -1,
    //                             $lt: location[0].longitude +1
    //                         }
    //                     }
    //                     }).then(function(devices){
    //                        var response; 
    //                         if(devices.length < 3){
    //                             for(d in devices){
    //                                 response = response + " " + d + ". " + devices[d];
    //                             }
    //                        }
    //                        
                            res.set('Content-Type', 'text/xml');
                            res.send('<Response><Message>'+""+location[0].latitude+","+location[0].longitude+'</Message></Response>');
    //                     });;
                });
          } else if(devices.length > 1){
                res.set('Content-Type', 'text/xml');
                res.send('<Response><Message>Device duplicate error.</Message></Response>');
            } else {
                //water (1 or 0), pH, turbidity, temperature
                var results = info.split(",");
                var test_results = [];
                for (r in results) {
                    var result = {};
                    result.result = results[r],
                    result.test_id = r,
                    result.device_id = devices[0].id
                    test_results.push(result);
                }
                models.TestResult.bulkCreate(test_results).then(function(result){
                        test_results.push(r);
                });
                console.log(test_results);
            }
        });*/
    });


    router.get('/texts/', function(req, res, next){
        res.render('textus');
    });
}
