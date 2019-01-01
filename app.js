require('dotenv').config();
const Influx = require('./lib/influx');
const SlackBot = require('slackbots');
const Weather = require('./lib/weather');

// Create & Configure Slackbot
let bot = new SlackBot({
    token: process.env.SLACK_API_TOKEN,
    name: process.env.SLACK_BOT_NAME,
});
let channel = process.env.SLACK_CHANNEL;
let params = {icon_emoji: ':wu:'};
let updateFrequency = process.env.UPDATE_FREQUENCY;

// Alert To Slax=ck We have Started
bot.postMessageToGroup(channel, 'Portland Weather Has Started', params);

// Catch errors
bot.on('error', (data) => {
    console.log(data);
});

Weather.getData();

function getData() {
    Weather.getData().then(Influx.writeInflux).then(function() {
        setTimeout(getData, updateFrequency);
    }).catch(function(e) {
        bot.postMessageToGroup(channel, 'Error: ' + e.message);
        console.log('Error: ' + e.message);
        // Retry on error, but timeout for 5 minutes
        setTimeout(getData, 300000);
    });
};

// Start after 10 seconds
setTimeout(function() {
    getData();
}, 10000);
