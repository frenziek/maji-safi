
var auth = {};
  auth.localStrategy = new PassportLocalStrategy({
    email: 'email',
    password: 'password'
  },

  function (email, password, done){
    var Admin = require('./models/cereal.js').Admin;
    Admin.find({email: email}).success(function(admin){
      if (!admin){
        return done(null, false, { message: 'Nobody here by that name'} );
      }
      if (admin.password !== password){
        return done(null, false, { message: 'Wrong password'} );
      }
      return done(null, { email: admin.email });
    });
  }
);

auth.validPassword = function(password){
  return this.password === password;
}

auth.serializeUser = function(admin, done){
  done(null, admin);
};

auth.deserializeUser = function(obj, done){
  done(null, obj);
};

module.exports = auth;