var flash = require("flash");
var passport = require("passport");
LocalStrategy = require('passport-local').Strategy;

app.use(express.cookieParser());
app.use(express.bodyParser())
app.use(flash());
app.use(express.session({ secret: 'so secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

var Sequelize = require('sequelize');
var pg = require('pg').native;
var PassportLocalStrategy = require('passport-local').Strategy;

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
});

User.sync();

var auth = {};
  auth.localStrategy = new PassportLocalStrategy({
    username: 'username',
    password: 'password'
  },

  function (username, password, done){
    var User = require('./User').User;
    User.find({username: username}).success(function(user){
      if (!user){
        return done(null, false, { message: 'Nobody here by that name'} );
      }
      if (user.password !== password){
        return done(null, false, { message: 'Wrong password'} );
      }
      return done(null, { username: user.username });
    });
  }
);

auth.validPassword = function(password){
  return this.password === password;
}

auth.serializeUser = function(user, done){
  done(null, user);
};

auth.deserializeUser = function(obj, done){
  done(null, obj);
};


var passport = require('passport');
var AuthController = {

  login: passport.authenticate('local', {
    successRedirect: '/auth/login/success',
    failureRedirect: '/auth/login/failure'
  }),

  loginSuccess: function(req, res){
    res.json({
      success: true,
      user: req.session.passport.user
    });
  },

  loginFailure: function(req, res){
    res.json({
      success:false,
      message: 'Invalid username or password.'
    });
  },

  logout: function(req, res){
    req.logout();
    res.end();
  },
};

app.listen(3000);