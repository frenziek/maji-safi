var models = require('../models/cereal.js');
var Promise = require('bluebird');

module.exports = function(router, passport){
    router.get('/', function(req, res, next) {
        res.render('index', { admin : req.user});
    });

    router.get('/data', function(req, res, next){
        res.render('data', req.body);
    });

    //DATA ROUTE
    router.post('/data', function(req, res, next){
        var query = req.body;
        models.Device.findAll()
        .then(function(results){
            //need to sort by location and paginate
            res.render('data', results);
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
        res.render('admin/login');
    });

    router.post('/login',  passport.authenticate('local-login', {
            successRedirect : '/admin', 
            failureRedirect : '/login', 
            failureFlash : true 
            }));

    router.get('/register', isntLoggedIn, function(req, res, next) {
        res.render('admin/register');
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