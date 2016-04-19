var Sequelize = require('sequelize');
var sequelize = new Sequelize("postgres://postgres:kaitlin1@localhost:5432/sdp");
    //process.env.SDP_DATABASE_URL);
var Promise = require("bluebird");
var bcrypt = require('bcrypt-nodejs');
var twilio = require('../config/twilio.js').twilio;
var twilio_number = require('../config/twilio.js').number;

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
    location_x: { type: Sequelize.STRING, allowNull: true, defaultValue: '42.3732' },
    location_y: { type: Sequelize.STRING, allowNull: true, defaultValue: '-72.5199' },
    registered:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    run_detect: {type: Sequelize.BOOLEAN},
    run_pH: {type: Sequelize.BOOLEAN},
    run_turbidity: {type: Sequelize.BOOLEAN},
    run_temperature: {type: Sequelize.BOOLEAN},
    frequency: {type: Sequelize.INTEGER, defaultValue: 5}    
});

Device.belongsTo(Admin);

Device.beforeCreate(function(device, options){
    var message = 'c ';
    if(device.run_detect){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    if(device.run_pH){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    if(device.run_turbidity){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    if(device.run_temperature){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    message = message + device.frequency;
    twilio.messages.create({ 
            to: device.phone_number, 
            from: twilio_number, 
            body: message,   
        }, function(err, message) { 
            if(err) console.log(err);
    });
});

Device.beforeUpdate(function(device, options){
    var message = 'c ';
    if(device.run_detect){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    if(device.run_pH){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    if(device.run_turbidity){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    if(device.run_temperature){
        message = message + "1,"   
    } else {
        message = message + "0,"   
    }
    message = message + device.frequency;
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


var Test = sequelize.define('Test', {
    id: { type: Sequelize.INTEGER, primaryKey: true},
    test_name: { type: Sequelize.STRING, allowNull: false }
});

var TestResult = sequelize.define('TestResult', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    result: { type: Sequelize.STRING },
    time:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    test_id: { type: Sequelize.INTEGER},
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

Admin.sync();
Device.sync();
Test.sync();
TestResult.sync();
UserRequest.sync();

Promise.all(Test.findOrCreate(
    {where:{ 
        id: 0,
        test_name: "Water Detection"
    }}), 
    Test.findOrCreate(
    {where:{ 
        id: 1,
        test_name: "pH"
    }}),
    Test.findOrCreate(
    {where:{ 
        id: 2,
        test_name: "Turbidity"
    }}),
    Test.findOrCreate(
    {where:{ 
        id: 3,
        test_name: "Temperature"
    }})
);


exports.module = sequelize;
exports.Device = Device;
exports.Test = Test;
exports.TestResult = TestResult;
exports.Admin = Admin;
exports.UserRequest = UserRequest;

