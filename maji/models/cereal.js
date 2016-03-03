var Sequelize = require('sequelize');
// var pg = require('pg');
var connectionString = process.env.SDP_DATABASE_URL;
var sequelize = new Sequelize(connectionString);
var Promise = require("bluebird");
  //  passportLocalSequelize = require('passport-local-sequelize');
var bcrypt = require('bcrypt-nodejs');


var Admin = sequelize.define('Admin', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    email: { type: Sequelize.STRING, allowNull: false },
    display_name: { type: Sequelize.STRING, allowNull: false },
    pwhash: { type: Sequelize.STRING(1024), allowNull: false },
    salt: { type: Sequelize.STRING },
    created:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    country: {type: Sequelize.STRING}
}, {
    instanceMethods:{
        generateHash : function(password){
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
        validPassword: function(password){
            return bcrypt.compareSync(password, this.password);
        }
    }
} 
);

/*
passportLocalSequelize.attachToUser(Admin, {
    usernameField: 'nick',
    hashField: 'pwhash',
    saltField: 'salt',
    passReqToCallback: true
});
*/
var Device = sequelize.define('Device', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4()},
    nickname: { type: Sequelize.STRING},
    phone_number: { type: Sequelize.STRING, allowNull: false },
    location_x: { type: Sequelize.STRING, allowNull: true, defaultValue: '42.5' },
    location_y: { type: Sequelize.STRING, allowNull: true, defaultValue: '42.5' },
    registered:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    run_detect: {type: Sequelize.BOOLEAN},
    run_pH: {type: Sequelize.BOOLEAN},
    run_turbidity: {type: Sequelize.BOOLEAN},
    run_temperature: {type: Sequelize.BOOLEAN},
    frequency: {type: Sequelize.INTEGER, defaultValue: 5}    
});

Admin.belongsToMany(Device, {through: 'AdminDevice'});
Device.belongsToMany(Admin, {through: 'AdminDevice'});


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

// TestResult.hasOne(Test, {as: 'TestType', foreignKey: 'test_id'});
// TestResult.hasOne(Device, {as: 'Device', foreignKey: 'device_id'});
// Device.hasMany(TestResult, {as: 'Result'});

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
/*  

DeviceRec.hasOne(UserRequest, {as: 'UserRequest', foreignKey: 'request_id'});
DeviceRec.hasOne(Device, {as: 'Device', foreignKey: 'device_id'});
Device.hasMany(DeviceRec, {as: 'Reccomendation'});*/


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
