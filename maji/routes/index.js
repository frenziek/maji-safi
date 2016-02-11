var express = require('express');
var router = express.Router();
var models = require('../models/cereal.js');
var Promise = require('bluebird');
var googleMapsKey = "AIzaSyCnNV7W3U8Ge4AXiWPIrmhWZmOlClHaOo0";
var geocoderProvider = 'google';
var httpAdapter = 'https';
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
var passport = require('passport');
var crypto = require('crypto');
//require the Twilio module and create a REST client 
var twilio = require('twilio')(accountSid, authToken); 

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session);
    res.render('index', { admin : req.admin});
});

router.get('/data', function(req, res, next){
    res.render('data');
});

//DATA ROUTE
router.post('/data', function(req, res, next){
    var query = req.body;
    models.TestResult.findAll()
    .then(function(results){
        res.send(results);
    });
});

//ADMIN ROUTES
router.get('/admins/:admin_id', function(req, res, next){
    var admin_id = req.params.admin_id;
    models.Admins.findAll({
            where: {
                id: admin
            }
            }).then(function(device){
                res.render('admin', admin);
            });
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
        }));

router.post('/register/', function(req, res, next){
    var signup = req.body;
    var pwhash, salt;
    var options = {
        activationkeylen:  8,
        resetPasswordkeylen:  8,
        saltlen:  32,
        iterations:  12000,
        keylen:  512,
        usernameField: 'email',
        usernameLowerCase: false,
        activationRequired: false,
        hashField: 'pwhash',
        saltField: 'salt',
        activationKeyField: 'activationKey',
        resetPasswordKeyField: 'resetPasswordKey',
        incorrectPasswordError: 'Incorrect password',
        incorrectUsernameError: 'Incorrect username',
        invalidActivationKeyError: 'Invalid activation key',
        invalidResetPasswordKeyError: 'Invalid reset password key',
        missingUsernameError: 'Field %s is not set',
        missingFieldError: 'Field %s is not set',
        missingPasswordError: 'Password argument not set!',
        userExistsError: 'User already exists with %s',
        activationError: 'Email activation required',
        noSaltValueStoredError: 'Authentication not possible. No salt value stored in db!'
    };
    if (!signup.password) {
        console.log("no pass");
    }
    crypto.randomBytes(options.saltlen, function (err, buf) {
            if (err) {
                console.log("random fail");
            }
            salt = buf.toString('hex');
            crypto.pbkdf2(signup.password, salt, options.iterations, options.keylen, function (err, hashRaw) {
                if (err) {
                     console.log("hash fail");
                }
                pwhash = new Buffer(hashRaw, 'binary').toString('hex');
                models.Admin.create({ 
                        email: signup.email, 
                        display_name: signup.display_name, 
                        pwhash: pwhash,  
                        country: signup.country,  
                        salt: salt
                })
                .then(function(admin){
                    admin.authenticate(signup.password, function (err, authenticated){
                        console.log("All set " + authenticated.display_name +"...sending you back home.");
                        res.redirect("/"); 
                    });
            });
            });
            
    });
    
});

router.put('/admins/:admin_id', function(req, res, next){
    models.Admin.findById(admin_id).then(function(admin) {
        res.send(admin.display_name);
    });
});

router.delete('/admins/:admin_id', function(req, res, next){
    models.Admin.findById(admin_id).then(function(admin) {
        res.send(admin.display_name);
    });
});


//DEVICE ROUTES
router.get('/adddevice/', function(req, res, next){
  res.render('adddevice', { });
});

router.get('/devices/:device_id', function(req, res, next){
    var device_id = req.params.device_id;
    models.Device.findAll({
            where: {
                id: device_id
            }
            }).then(function(device){
                res.render('device', device);
            });
});

//all
router.get('/devices/', function(req, res, next){
    models.Device.findAll().then(function(devices){
        res.send(devices);
    });
});

router.get('/testresults/', function(req, res, next){
    models.TestResult.findAll().then(function(results){
        res.send(results);
    });
});

router.post('/devices/', function(req, res, next){
    var device = req.body;
    var run_detect, run_pH, run_temperature, run_turbidity = false;
    if( device.run_detect == "yes") run_detect = true;
    if( device.run_pH == "yes") run_pH = true;
    if( device.run_temperature == "yes") run_temperature = true;
    if( device.run_turbidity == "yes") run_turbidity = true;
    models.Device.create({ 
            nickname: device.nickname,
            phone_number: device.phone_number,
            run_detect: run_detect,
            run_pH: run_pH, 
            run_turbidity: run_turbidity,
            run_temperature: run_temperature,
            frequency: device.frequency
    })
    .then(function(dev){
         res.redirect('/devices/'+ dev.id);
    });
});

router.put('/devices/:device_id', function(req, res, next){
    
});

router.delete('/devices/:device_id', function(req, res, next){
    
});

router.get('/testtext', function(req, res, next){
    res.render('testtext');
});

router.post('/testtext', function(req, res, next){
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
router.post('/text', function(req, res, next){
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
//                        */
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

router.get('/text', function(req, res, next){
    res.send('To text Maji Safi, sign up.');
});

module.exports = router;
