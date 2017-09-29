var Sequelize = require('sequelize');
var url = process.env.DATABASE_URL || 'sqlite://maji_dev.sqlite';
var sequelize = new Sequelize(url);
var Promise = require("bluebird");
var bcrypt = require('bcrypt-nodejs');
var twilio = require('../config/twilio.js').twilio;
var twilio_number = require('../config/twilio.js').number;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('ERROR: Unable to connect to the database:', err);
  });


var Admin = sequelize.define('Admin', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    email: { type: Sequelize.STRING, allowNull: false },
    display_name: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING(1024), allowNull: false },
    created:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    country: {type: Sequelize.STRING}
}, {
    instanceMethods:{
        validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }   
} 
);

Admin.beforeCreate(function(user, options) {
    console.log(user.password);
    var hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    user.password = hash;
});

var Device = sequelize.define('Device', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    nickname: { type: Sequelize.STRING},
    phone_number: { type: Sequelize.STRING, allowNull: false },
    location_x: { type: Sequelize.FLOAT, allowNull: true, defaultValue: 42.3732 },
    location_y: { type: Sequelize.FLOAT, allowNull: true, defaultValue: -72.5199 },
    registered:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    sampling_rate:  {type: Sequelize.INTEGER, defaultValue: 5},
    messaging_rate: {type: Sequelize.INTEGER, defaultValue: 5}    
});

Device.belongsTo(Admin);

Device.beforeCreate(function(device, options){
    var message = 'C ';
    message = message + device.sampling_rate + ",";
    message = message + device.messaging_rate + ",";
    twilio.messages.create({ 
            to: device.phone_number, 
            from: twilio_number, 
            body: message,   
        }, function(err, message) { 
            if(err) console.log(err);
    });
});

Device.beforeUpdate(function(device, options){
    var message = 'C ';
    message = message + device.sampling_rate + ",";
    message = message + device.messaging_rate+ ",";
    twilio.messages.create({ 
            to: device.phone_number, 
            from: twilio_number, 
            body: message,   
        }, function(err, message) { 
            if(err) console.log(err);
    });
});

Device.beforeDestroy(function(device, options){
    twilio.messages.create({ 
            to: device.phone_number, 
            from: twilio_number, 
            body: "STOP",   
        }, function(err, message) { 
            if(err) console.log(err);
    });
});


var TestResult = sequelize.define('TestResult', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    water: { type: Sequelize.BOOLEAN },
    pH: { type: Sequelize.FLOAT },
    turbidity: { type: Sequelize.FLOAT },
    temperature: { type: Sequelize.FLOAT },
    time:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    device_id: {type: Sequelize.UUID}
});


var UserRequest = sequelize.define('UserRequest', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    number_hash: {type: Sequelize.STRING},
    time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }, 
    request: { type: Sequelize.STRING}
});

var DeviceRec = sequelize.define('DeviceRec', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }, 
    device_id: {type: Sequelize.UUID},
    request_id: {type: Sequelize.UUID},
    rank: {type: Sequelize.INTEGER}
});

sequelize.sync();


exports.module = sequelize;
exports.Device = Device;
exports.TestResult = TestResult;
exports.Admin = Admin;
exports.UserRequest = UserRequest;

