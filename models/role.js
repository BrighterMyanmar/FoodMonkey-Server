const RedisService = require('../utils/redis');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const Helper = require('../utils/helper')

const RoleSchema = new Schema({
    name: { type: String, unique: true, required: true },
    level: { type: Number, unique: true, required: true },
    permits: [{ type: Schema.Types.ObjectId, ref: 'permit' }],
});


RoleSchema.statics.add = async function (data) {
    let resp = { con: false, msg: "", result: "" };
    let ro = await this.findOne({ name: data.name });
    if (ro) {
        resp.msg = "Role already exist!";
    } else {
        let ros = await this.findOne({ level: data.level });
        if (ros) {
            resp.msg = "Role level already exist!";
        } else {
            await new this(data).save();
            resp.msg = "Role Successfully Created";
            resp.con = true;
        }
    }
    return resp;
}

RoleSchema.statics.addPermit = async function (roleId, permitId) {
    let resp = { con: false, msg: "", result: "" };
    let role = await this.findOne({ _id: roleId });
    if (role) {
        let existPermit = role.permits.filter((permit) => permit.equals(permitId));
        if (existPermit.length > 0) {
            resp.msg = "Permission already exist!";
        } else {
            resp.con = true;
            resp.msg = "Permission added to Role";
            let addResult = await this.findByIdAndUpdate(roleId, { $push: { permits: permitId } });
            resp.result = await this.findById(addResult._id);
        }
    } else {
        resp.msg = "No role with that id";
    }
    return resp;
}

RoleSchema.statics.removePermit = async function (roleId, permitId) {
    let resp = { con: false, msg: "", result: "" };
    let role = await this.findOne({ _id: roleId });
    if (role) {
        resp.con = true;
        resp.msg = "Permission removed from Role";
        await this.findByIdAndUpdate(roleId, { $pull: { permits: permitId } });
        resp.result = await this.findById(roleId);
    } else {
        resp.msg = "No role with that id";
    }
    return resp;

}

RoleSchema.statics.getRoleByName = async function (name) {
    return await this.findOne({ name: name });
}


const Role = mongoose.model('role', RoleSchema);

module.exports = Role;