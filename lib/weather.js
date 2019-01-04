require('dotenv').config();
let weather = require('openweather-apis');

weather.setLang('en');
weather.setZipCode( process.env.ZIP_CODE);
weather.setAPPID(process.env.OPENWEATHER_KEY);
let data = {};

exports.getData = function() {
    return new Promise(function(resolve, reject) {
        weather.getAllWeather(function(err, JSONObj) {
            if(err) {
                return reject(new Error(err));
            }

            if(JSONObj.main.temp === undefined) {
                return reject(new Error('Undefined Json Data Returned'));
            }

            data['current_temperature'] = JSONObj.main.temp;
            data['current_humidity'] = JSONObj.main.humidity;
            data['pressure_mb'] = JSONObj.main.pressure;

            // We Have Vaid JSON  Data
            resolve(data);
        });
    });
};
