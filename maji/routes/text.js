var express = require('express');
var router = express.Router();
var models = require('../models/cereal.js');
var maps = require('../config/maps.js');
var Promise = require("bluebird");

var twilio = require('../config/twilio.js').twilio;
var twilio_number = require('../config/twilio.js').number;

module.exports = function(router){
    router.get('/texts/test', function(req, res, next){
        res.render('texts/test');
    });

    router.post('/texts/test', function(req, res, next){
        var message = req.body;
        var tmess = message.Body.split("=")[1];
        console.log(message);
        console.log(message.device_number);
        twilio.messages.create({ 
            to: message.device_number, 
            from: twilio_number, 
            body: tmess,   
        }, function(err, message) { 
            if(err){
                console.log(err);    
                res.send("uh oh");
            } else{
                console.log(message.sid); 
                res.send('smashign');
            }
        });
    });

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
                        maps.geocoder.geocode(info, function(err, location){
                            if(err || location.length==0){
                                console.log("test");
                                res.send('<Response><Message>Oops! That does not look like a valid location. Please retry.</Message></Response>');
                            }
                            maps.proximitySort(location[0].latitude, location[0].longitude, devices, function(results){
                                var rescount = 3;
                                if(results.length < 3) rescount = results.length;
                                var yesterday = (new Date()).getDay - 1;
                                var promises = [];
                                for(i=0; i < rescount; i++){
                                    promises.push( function(){
                                        models.TestResult.findOne({
                                                limit: 4,
                                                where:{
                                                    device_id: results.device.id,
                                                    time: {
                                                        $gte: yesterday
                                                    },
                                                }
                                            }).then(function(results){
                                            callback(results.device.nickname, "good");
                                        });
                                    });
                                }
                                console.log("RESULTS: " + results);
                                var message = '';
                                Promise.all(promises).then(function(nickname, result) {
                                    message = message + nickname + " - " + result;
                                    res.send('<Response><Message>'+message+'</Message></Response>');
                                });
                            });                        
                        });
                    } else if(devices.length > 1){  
                        res.send('<Response><Message>Device duplicate error.</Message></Response>');
                    } else {
                        //water (1 or 0), pH, turbidity, temperature
                        var results = info.split(",");
                        var test_results = [];
                        if(results.length != 4){
                            res.send('<Response><Message>Message formatting error.</Message></Response>');   
                        }
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
    
    router.post("/text/sdrecord/:device_id", function(req, res){
        models.Device.findOne({ 
            where: { 
                id: req.params.device_id 
            } 
        }).then(function(device) {
            twilio.messages.create({ 
                to: device.phone_number, 
                from: twilio_number, 
                body: "R,"+req.body.duration+","+(new Date()).toISOString()  
            }, function(err, message) { 
                if(err) console.log(err);
                else{
                    res.status(200);
                    res.contentType('text/html');
                    res.send( JSON.stringify({success: "yee buddy", }));
                }

            }); 
        });
    });

}

function resultAsync(id, nickname, callback){
   
}
