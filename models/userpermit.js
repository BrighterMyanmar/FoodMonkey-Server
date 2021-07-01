const RedisService = require('../utils/redis');
const mongoose = require('mongoose');
const UserRoleDB = require('./userrole');
const PermitDB = require('./permit');
const { Schema } = mongoose;


const userPermitSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    permits: { type: [{ type: Schema.Types.ObjectId, ref: 'permit' }], default: [] },
});

userPermitSchema.statics.allPermitIds = async function (userId) {
    let rolePermits = await UserRoleDB.getRolePermits(userId);
    let userPermit = await this.findOne({ userId });
    let allPermits = [];
    if (userPermit) {
        allPermits = rolePermits.concat(userPermit.permits);
    } else {
        allPermits = rolePermits;
    }
    return allPermits;
}

userPermitSchema.statics.all = async function (userId) {
    let allPermits = await this.allPermitIds(userId);
    let permissions = await PermitDB.find({ _id: { $in: allPermits } });
    return permissions;
}

userPermitSchema.statics.add = async function (userId, permitId) {
    let resp = { con: false, msg: "", result: "" };
    let permits = await this.allPermitIds(userId);

    let existPermit = permits.filter((p) => p.equals(permitId));

    if (existPermit.length > 0) {
        resp.msg = "Permission already exist for that user!"
    } else {
        let uPermit = await this.findOne({ userId });
        if (uPermit) {
            resp.con = true;
            resp.msg = "Permit Pushed";
            await this.findByIdAndUpdate(uPermit._id, { $push: { permits: permitId } });
            resp.result = await this.all(userId);
        } else {
            resp.con = true;
            resp.msg = "Permit Added";
            await new this({ userId: userId, permits: [permitId] }).save();
            resp.result = await this.all(userId);
        }
    }
    return resp;
}

userPermitSchema.statics.remove = async function (userId, permitId) {
    let resp = { con: false, msg: "", result: "" };
    let userPermit = await this.findOne({ userId });
    if (userPermit) {
        resp.con = true;
        resp.msg = "Permission removed!";
        await this.findByIdAndUpdate(userPermit._id, { $pull: { permits: permitId } });
        resp.result = await this.all(userId);
    } else {
        resp.msg = "User Has not that Permit yet!";
    }
    return resp;
}

userPermitSchema.statics.hasPermit = async function (userId, permitId) {
    let allPermits = await this.allPermitIds(userId);
    console.log("All User's Permits", allPermits);
    let permissions = await PermitDB.find({ _id: { $in: allPermits } });
    let uPermits = permissions.filter((p) => p._id == permitId);
    return uPermits.length > 0;
}

const UserPermit = mongoose.model('userpermit', userPermitSchema);

module.exports = UserPermit;