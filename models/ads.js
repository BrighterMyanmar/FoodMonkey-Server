const mongoose = require('mongoose');
const { Schema } = mongoose;

let AdsSchema = new Schema({
    splash: { type: String, required: true },
    home: { type: String, required: true },
    products: { type: String, required: true },
    detail: { type: String, required: true },
    cart: { type: String, required: true },
    login: { type: String, required: true },
    register: { type: String, required: true },
    order_history: { type: String, required: true },
    order_detail: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});
const Ads = mongoose.model('ads', AdsSchema);
module.exports = Ads;