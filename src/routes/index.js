var models = require('../models/index.js');
var Promise = require('bluebird');
var maps = require('../config/maps.js');

module.exports = function(router, passport){
    router.get('/', function(req, res, next) {
        res.render('index', { admin : req.user});
    });

    //DATA ROUTE
    router.post('/data', function(req, res, next){
        var query = req.body;
        models.Device.findAll()
        .then(function(devices){
            maps.geocoder.geocode(query.location, function(err, location){
                if(location.length == 0){
                    req.flash('searchError', "Oops! We couldn't find that location!");
                    res.redirect('/data');
                }
                maps.proximitySort(location[0].latitude, location[0].longitude, devices, function(results){
                    res.render('data', {
                        search: query,
                        results: results
                    });
                });
            });
        });
    });

    //ADMIN ROUTES
    router.get('/admin', isLoggedIn, function(req, res, next){
        var admin = req.user;
        models.Device.findAll({
            where: {
                AdminId: admin.id
            }}).then(function(devices){
                res.render('admin/admin', {
                    admin: admin,
                    adminDevices: devices,
                    title: "Welcome"
                });
        });
    })

    router.get('/login', isntLoggedIn, function(req, res, next) {
        res.render('admin/login',{ 
            messages: req.flash('loginMessage'), 
        });
    });

    router.post('/login',  passport.authenticate('local-login', {
            successRedirect : '/admin', 
            failureRedirect : '/login', 
            failureFlash : true
            }));

    router.get('/register', isntLoggedIn, function(req, res, next) {
        res.render('admin/register', { messages: req.flash('signupMessage') });
    });

    router.post('/register', passport.authenticate('local-signup', {
            successRedirect : '/admin', 
            failureRedirect : '/register', 
            failureFlash : true 
        }));
    
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    require('./devices')(router, passport);
    require('./text')(router);
    

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

function isntLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/admin');
}