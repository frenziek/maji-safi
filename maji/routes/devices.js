var express = require('express');
var router = express.Router();
var models = require('../models/cereal.js');
var Promise = require('bluebird');
var httpAdapter = 'https';

//DEVICE ROUTES
router.get('/add', function(req, res, next){
  res.render('adddevice', { });
});

router.get('/:device_id', function(req, res, next){
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
router.get('/all', function(req, res, next){
    models.Device.findAll().then(function(devices){
        res.send(devices);
    });
});

router.get('/testresults/', function(req, res, next){
    models.TestResult.findAll().then(function(results){
        res.send(results);
    });
});

router.post('/', function(req, res, next){
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

router.put('/:device_id', function(req, res, next){
    
});

router.delete('/:device_id', function(req, res, next){
    
});


module.exports = router;
