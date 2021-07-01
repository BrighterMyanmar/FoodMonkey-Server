const RedisService = require('../utils/redis');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Helper = require('../utils/helper')

const PermitSchema = new Schema({
    name: { type: String, unique: true, required: true },
});

PermitSchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let existPermit = await this.findOne(body);
    if (existPermit) {
        resp.msg = "Permit is Already exist!";
    } else {
        await new this(body).save();
        resp.msg = "Permit Successfully Created";
        resp.con = true;
    }
    return resp;
}

const Permit = mongoose.model('permit', PermitSchema);

module.exports = Permit;
