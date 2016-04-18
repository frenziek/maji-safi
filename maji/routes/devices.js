var express = require('express');
var router = express.Router();
var models = require('../models/cereal.js');
var Promise = require('bluebird');
var httpAdapter = 'https';


module.exports = function(router, passport){
    //DEVICE ROUTES
    router.get('/devices', function(req, res, next){
        res.redirect('/admin'); 
    });
    
    router.get('/devices/add',isLoggedIn, function(req, res, next){
        var admin = req.user;
        res.render('admin/adddevice', { admin: admin});
    });

    router.get('/devices/:device_id', function(req, res, next){
        var admin = req.user;
        var device_id = req.params.device_id;
        models.Device.findAll({
                where: {
                    id: device_id
                }
            }).then(function(device){
                models.TestResult.findAll({
                    where: {
                        device_id: device_id   
                    }
                }).then(function(results){
                    res.render('admin/device', {
                        device: device[0],
                        results: results,
                        admin: admin
                    });
                });
            });
    });

    router.post('/devices/add', isLoggedIn, function(req, res){
        var admin = req.user;
        var device = req.body;
        models.Device.create({ 
                nickname: device.nickname,
                phone_number: device.phone_number,
                location_x: device.location_x,
                location_y: device.location_y,
                run_detect: device.run_detect,
                run_pH: device.run_pH, 
                run_turbidity: device.run_turbidity,
                run_temperature: device.run_temperature,
                frequency: device.frequency,
                AdminId: admin.id,
        })
        .then(function(dev){
             res.redirect('/devices/'+ dev.id);
        });
    });

    router.post('/devices/update/:device_id', isLoggedIn, function(req, res){
        var input = req.body;
        models.Device.findOne({ 
            where: { id: req.params.device_id } 
        }).then(function(device) {
            device.update({ 
                nickname: input.nickname,
                phone_number: input.phone_number,
                location_x: input.location_x,
                location_y: input.location_y,
                run_detect: input.run_detect,
                run_pH: input.run_pH, 
                run_turbidity: input.run_turbidity,
                run_temperature: input.run_temperature,
                frequency: input.frequency,
            }).then(function(dev){
                res.redirect('/devices/'+dev.id);         
            });
        });
    });
    

    router.get('/devices/delete/:device_id', isLoggedIn, function(req, res, next){
        models.Device.findOne({ 
            where: { 
                id: req.params.device_id 
            } 
        }).then(function(device) {
            device.destroy();
            res.redirect('/admin');
        });
    });

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
