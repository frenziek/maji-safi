# Maji Safi

Maji Safi was a 2016 Umass Amherst ECE Senior Design project. This is the web component of the project, which was designed to allow monitoring of remote water sources via SMS. A remotely controlled floating data collection module (nicknamed "The Bubble") was designed to be placed in a water source and reported to the web app 1) whether water was present and what the 2) pH, 3) temperature and 4) turbidity of that water was. Users could then text a number and recieve information about which water sources around them had clean water.

### [Project Website](http://www.ecs.umass.edu/ece/sdp/sdp16/team13/MajiSafiWebsite.html)

An archived version of the web app lives [on Glitch](https://maji-safi.glitch.me/), though the Bubble is not on or in water, and the original twilio number is disconnected. 

### Installation
To install, clone the repository and run `npm install` to install dependencies. To use the full functionality of the app, the following environment variables are requried in a .env file:
```
GOOGLE_MAPS_API_KEY=
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_NUMBER=
SESSION_SECRET=
```
Use `npm start` to run the app. By default, the app will create a local sqlite database, but instantiating a DATABASE\_URL variable in the env file will override that. 
