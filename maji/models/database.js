var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://sdp:majisafi@localhost:5432/sdp';

var client = new pg.Client(connectionString);
client.connect();

var mkadmins = client.query('CREATE TABLE IF NOT EXISTS '+
                    'admins(id UUID PRIMARY KEY, '+
                    'email VARCHAR(40) not null,'+
                    'display_name VARCHAR(40) not null,'+
                    'pwhash VARCHAR(40) not null,'+
                    'created DATE, '+
                    'country VARCHAR(40) )');

mkadmins.on('end', function() { 

var mkdevices = client.query('CREATE TABLE IF NOT EXISTS '+
                    'devices(id UUID PRIMARY KEY, '+
                    'phonenumber VARCHAR(40) not null,'+
                    'locationx VARCHAR(40),'+
                    'locationy VARCHAR(40),'+
                    'registered DATE, '+
                    'run_detect BOOLEAN, '+
                    'run_pH BOOLEAN, '+
                    'run_turbidity BOOLEAN, '+
                    'run_temperature BOOLEAN, '+
                    'frequency INTEGER'+
                    ')');

mkdevices.on('end', function() { 

//table describing which admins are allowed to control which devices
var mkadmindevices = client.query('CREATE TABLE IF NOT EXISTS '+
                    'admindevices(id SERIAL PRIMARY KEY, '+
                    'admin_id UUID, '+
                    'device_id UUID, '+
                    'FOREIGN KEY (admin_id) REFERENCES admins (id),'+
                    'FOREIGN KEY (device_id) REFERENCES devices (id) )');

mkadmindevices.on('end', function() { 

var mktests = client.query('CREATE TABLE IF NOT EXISTS '+
                    'tests(id UUID PRIMARY KEY, '+
                    'test_name VARCHAR(40) )');

mktests.on('end', function() { 


var mktestresults = client.query('CREATE TABLE IF NOT EXISTS '+
                    'testresults(id SERIAL PRIMARY KEY, '+
                    'result VARCHAR(40), '+
                    'time TIMESTAMP,'+
                    'test_id UUID, '+
                    'device_id UUID, '+
                    'FOREIGN KEY (device_id) REFERENCES devices (id),'+
                    'FOREIGN KEY (test_id) REFERENCES tests (id)'+
                    ')');

mktestresults.on('end', function() { 

var mkuserrequests = client.query('CREATE TABLE IF NOT EXISTS '+
                    'userrequests(id UUID PRIMARY KEY, '+
                    'numberhash VARCHAR(40), '+
                    'time TIMESTAMP,'+
                    'reply VARCHAR(256)'+
                    ')');

mkuserrequests.on('end', function() {     
    
var mkreccomendeddevices = client.query('CREATE TABLE IF NOT EXISTS '+
                    'reccomendeddevices(id UUID PRIMARY KEY, '+
                    'request_id UUID, '+
                    'time TIMESTAMP,'+
                    'device_id UUID, '+
                    'rank SMALLINT, '+
                    'FOREIGN KEY (device_id) REFERENCES devices (id),'+
                    'FOREIGN KEY (request_id) REFERENCES userrequests (id)'+
                    ')');

mkreccomendeddevices.on('end', function() { 
        client.end(); 
        });    
     }); 
});  });  });   });   });
