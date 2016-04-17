var express = require('express');
var router = express.Router();
var models = require('../models/cereal.js');
var Promise = require('bluebird');
var httpAdapter = 'https';


module.exports = function(router, passport){
    //DEVICE ROUTES
    router.get('/devices/add',isLoggedIn, function(req, res, next){
        var admin = req.user;
        res.render('adddevice', { admin: admin});
    });

    router.get('/devices/:device_id', function(req, res, next){
        var device_id = req.params.device_id;
        models.Device.findAll({
                where: {
                    id: device_id
                }
            }).then(function(device){
                res.redirect('/admins');
            });
    });

    //all
    router.get('/devices/all', function(req, res){
        models.Device.findAll().then(function(devices){
            res.send(devices);
        });
    });

    router.get('/devices/testresults/', function(req, res){
        models.TestResult.findAll().then(function(results){
            res.send(results);
        });
    });

    router.post('/devices/', function(req, res){
        var admin = req.user;
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
                frequency: device.frequency,
                AdminId: admin.id,
        })
        .then(function(dev){
             res.redirect('/devices/'+ dev.id);
        });
    });

    router.put('/devices/:device_id', function(req, res){

    });

    router.delete('/devices/:device_id', function(req, res){

    });

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
