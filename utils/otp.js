const accountSid = 'AC833fe40e174f702d56b82f39fb793404';
const authToken = 'a382aa4156b016313ad196e03f739f67';
const client = require('twilio')(accountSid, authToken);
const Helper = require('../utils/helper');

let sendOTP = async (res, phone, code) => {
    client.messages
        .create({
            body: `${code} is your verification code from 72coder?`,
            from: '+12057406686', // my american phone +12023353934
            to: phone // send to my myanmar phone
        })
        .then(message => {
            Helper.fMsg(res, "We send OTP code to your phone, please verify it!");
        })
        .catch((error) => {
            console.log("Twilio Error ", error);
        });
}

module.exports = {
    sendOTP
}