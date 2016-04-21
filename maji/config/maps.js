var googleMapsKey = "AIzaSyCBScX13K21yXDKe5131QXkwhLskNCQi6w";
var httpAdapter = 'https';
var geocoderProvider = 'google';
var extra = {
    apiKey: googleMapsKey,
    formatter: null       
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
var R = 6371; // earths radius



exports.proximitySort = function(lat, long, devices, callback){
    var results = [];
    devices.forEach(function(d){
        var lat2 = parseFloat(d.location_x);
        var long2 = parseFloat(d.location_y);
        var dist = (long2 -long)*(long2 -long) + (lat2-lat)*(lat2-lat);
        var rad1 = lat*Math.PI/180;
        var rad2 = lat2*Math.PI/180;
        var d21 = (long2-long)*Math.PI/180;
        var c = Math.acos(Math.sin(rad1)*Math.sin(rad2)+Math.cos(rad1)*Math.cos(rad2)*Math.cos(d21));

        var distance = (R * c).toFixed(3);
        results.push({
            device: d,
            distance: distance,
        });
    });
    results.sort(function(a, b) {
        return a.dist - b.dist;
    });
    callback(results);
};

exports.geocoder = geocoder;