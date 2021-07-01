const RedisService = require('../utils/redis');
const mongoose = require('mongoose');
const RoleDB = require('./role');
const { Schema } = mongoose;

const Helper = require('../utils/helper')


const userRoleSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    roles: { type: [{ type: Schema.Types.ObjectId, ref: 'role' }], default: [] },
});

userRoleSchema.statics.migrateRole = async function (userId, roleId) {
    return await new this({ userId: userId, roles: [roleId] }).save();
}

userRoleSchema.statics.all = async function (userId) {
    let userRoles = await this.findOne({ userId });
    let roles = [];
    if (userRoles) {
        roles = await RoleDB.find({ _id: { $in: userRoles.roles } });
    }
    return roles;
}

userRoleSchema.statics.add = async function (userId, roleId) {
    let resp = { con: false, msg: "", result: "" };
    let userRole = await this.findOne({ userId });
    if (userRole) {
        let existRole = userRole.roles.filter((r) => r == roleId);
        if (existRole.length > 0) {
            resp.msg = "Role Already exist for that user!";
            resp.result = await this.all(userId);
        } else {
            resp.con = true;
            resp.msg = "Role Pushed";
            await this.findByIdAndUpdate(userRole._id, { $push: { roles: roleId } });
            resp.result = await this.all(userId);
        }
    } else {
        resp.con = true;
        resp.msg = "Role Added";
        await new this({ userId, roles: [roleId] }).save();
        resp.result = await this.all(userId);
    }
    return resp;
}

userRoleSchema.statics.remove = async function (userId, roleId) {
    let resp = { con: false, msg: "", result: "" };
    let userRole = await this.findOne({ userId });
    if (userRole) {
        let existRole = userRole.roles.filter((r) => r.equals(roleId));
        if (existRole.length > 0) {
            resp.con = true;
            resp.msg = "Role Removed!";
            await this.findByIdAndUpdate(userRole._id, { $pull: { roles: roleId } });
        } else {
            resp.msg = "User Has not that role yet!";
        }

    } else {
        resp.msg = "User Has not that role yet!";
    }
    resp.result = await this.all(userId);
    return resp;
}


userRoleSchema.statics.getRolePermits = async function (userId) {
    let roles = await this.all(userId);
    let permits = [];
    roles.map((role) => role.permits.map((pmit) => permits.push(pmit)));
    return permits;
}


userRoleSchema.statics.hasRole = async function (userId, roleId) {
    let roles = await this.all(userId);
    let uRoles = roles.filter((role) => role._id.equals(roleId));
    return uRoles.length > 0;
}

const UserRole = mongoose.model('userrole', userRoleSchema);

module.exports = UserRole;