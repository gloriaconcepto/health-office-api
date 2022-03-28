require("dotenv").config();

//Get authentication

const credentials = {
    apiKey: process.env.AFRICA_TALKING_USER_API_KEY,
    username: process.env.AFRICA_TALKING_USER_NAME,
};

const africasTalking = require("africastalking")(credentials);
const sms = africasTalking.SMS;

async function sendSms(to, message) {
    return sms.send({ to, message, enque: true });
}
module.exports = {
    sendSms,
};
