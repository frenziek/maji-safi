var express = require('express');
var router = express.Router();
var googleMapsKey = "AIzaSyCnNV7W3U8Ge4AXiWPIrmhWZmOlClHaOo0";
var httpAdapter = 'https';

var geocoderProvider = 'google';
var extra = {
    apiKey: googleMapsKey,
    formatter: null       
};
var twilio_number = "+17816763299";
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
//test creds
//var accountSid = 'AC74a25c39ba58c0b81f67d6504c0f0eed'; 
//var authToken = 'c9d73afc6b77cdec51431bfde8245b82'; 
//live creds
var accountSid = 'ACad57e3cdbbc6af707b3daa0ec60766a0';
var authToken = '0126dd3700c8b4aa528a9b99605e5d10';
//require the Twilio module and create a REST client 
var twilio = require('twilio')(accountSid, authToken); 



router.get('/test', function(req, res, next){
    res.render('testtext');
});

router.post('/test', function(req, res, next){
    var message = req.body;
    console.log(message.device_number);
    twilio.messages.create({ 
	to: message.device_number, 
	from: twilio_number, 
	body: "Run tests.",   
    }, function(err, message) { 
        if(err){
            console.log(err);    
            res.send("uh oh");
        } else{
            console.log(message.sid); 
            res.redirect("/testresults");
        }
    });
});


//TEXT MESSAGE FUNCTIONALITY
router.post('/', function(req, res, next){
    var sender = req.body.From;
    var info = req.body.Body;
    models.Device.findAll({
        where: {
            phone_number: sender.split("+1")[1],
        }
    }).then(function(devices){
        if(devices == null || devices.length == 0){
//             geocoder.geocode(info, function(err, location){
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
//             });
        } else if(devices.length > 1){
            res.set('Content-Type', 'text/xml');
            res.send('<Response><Message>Device duplicate error.</Message></Response>');
        } else {
        //water (1 or 0), pH, turbidity, temperature
            var results = info.split(",");
            var test_results = [];
            for (r in results) {
                test_results.push(models.TestResult.create({ result: results[r], test_id: r, device_id: devices[0].id}));
            }
            console.log(test_results);
            Promise.all(test_results).then(function(results){
                console.log("Results updated");
                res.set('Content-Type', 'text/xml');
                res.send('<Response><Message>Results recieved.</Message></Response>');
            });
        }
    });
});


router.get('/', function(req, res, next){
    res.send('To text Maji Safi, sign up.');
});


module.exports = router;
