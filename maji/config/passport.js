var LocalStrategy   = require('passport-local').Strategy;
var Admin = require('../models/cereal.js').Admin;

// expose this function to our app using module.exports
module.exports = function(passport) {
     passport.serializeUser(function(admin, done) {
        done(null, admin.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, admin) {
            done(err, admin);
        });
    });
    
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'pwhash',
            passReqToCallback : true 
    },
    function(req, email, password, done) {
       console.log('attempting auth');
        Admin.findOne({
            where: {
                'email' :  email
                } 
            }).then(function(err, admin) {
            console.log('found one');
            if (err)
                return done(err);
            if (!admin) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                console.log('heehehhe');
                Admin.create({ 
                        email: signup.email, 
                        display_name: signup.display_name, 
                        pwhash: this.generateHash(password),  
                        country: signup.country,  
                }).then(function(admin){
                    admin.authenticate(signup.password, function (err, authenticated){
                        console.log("All set " + authenticated.display_name +"...sending you back home.");
                        res.redirect("/admins/"+authenticated.id); 
                    })
                });
            }

        });    

    }));
    
     passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'pwhash',
            passReqToCallback : true 
        },
        function(req, email, password, done) { 
            Admin.findOne({ 'email' :  email }, function(err, admin) {
                if (err)
                    return done(err);
                if (!admin)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); 
                if(!admin.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
                return done(null, user);
            });

        }));

    };