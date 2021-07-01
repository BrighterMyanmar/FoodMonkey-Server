const mongoose = require('mongoose');
const { Schema } = mongoose;

const FCMTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const FCMToken = mongoose.model('fcmtoken', FCMTokenSchema);

module.exports = FCMToken