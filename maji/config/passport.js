var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/cereal').Admin;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({where:{ 'id' :  id }}).then(function(user) {
            done(null, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        User.findOne({where:{ 'email' :  email }}).then(function(user) {
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                User.create({
                    email: email,
                    password: password,
                    display_name: req.body.display_name
                }).then(function(user){
                   return done(null, user); 
                });
            }});    
        });
    }));
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        User.findOne({where:{ 'email' :  email }}).then(function(user) {
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
            return done(null, user);
        });

    }));

};
