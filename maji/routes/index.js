var express = require('express');
var router = express.Router();
var models = require('../models/cereal.js');
var Promise = require('bluebird');
var passport = require('passport');

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

router.get('/admins', isLoggedIn, function(req, res, next){
    var admin_id = req.session.passport.admin.id;
    models.Admins.findAll({
            where: {
                id: admin
            }
            }).then(function(device){
                res.render('admin', admin);
            });
})

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

router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admins', 
        failureRedirect : '/login', 
        failureFlash : true 
        }));

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/admins', 
        failureRedirect : '/register', 
        failureFlash : true 
    }));


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


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



module.exports = router;
