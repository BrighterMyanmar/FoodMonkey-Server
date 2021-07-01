const mongoose = require('mongoose');
const { Schema } = mongoose;

const WarrantySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    remarks: { type: Array },
});

WarrantySchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let subs = await this.find();
    let existCats = subs.filter((cat) => cat.name == body.name);
    if (existCats.length > 0) {
        resp.msg = "Warranty Name is already in use!";
    } else {
        await new this(body).save();
        resp.msg = "Warranty Successfully Created";
        resp.con = true;
    }
    return resp;
}

const Warranty = mongoose.model('warranty', WarrantySchema);

module.exports = Warranty;
