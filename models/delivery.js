const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeliverySchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    remarks: { type: Array }
});

DeliverySchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let subs = await this.find();
    let existCats = subs.filter((cat) => cat.name == body.name);
    if (existCats.length > 0) {
        resp.msg = "Delivery Name is already in use!";
    } else {
        await new this(body).save();
        resp.msg = "Delivery Successfully Created";
        resp.con = true;
    }
    return resp;
}

const Delivery = mongoose.model('delivery', DeliverySchema);

module.exports = Delivery;
