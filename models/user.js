const RedisService = require('../utils/redis');
const mongoose = require('mongoose');
const UserRoleDB = require('./userrole');
const UserPermitDB = require('./userpermit');
const { Schema } = mongoose;

const Helper = require('../utils/helper');

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },

    password: { type: String, required: true },
    status: { type: Boolean, default: true },

    fcmtoken: { type: String },
    avater: { type: String },
    otp: { type: Number },
    address: { type: String },
    geo: { type: String },
    fcmtoken: { type: String },

    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

UserSchema.statics.register = async function (user) {
    let resp = Helper.getResponse();
    user['password'] = Helper.encodePassword(user['password']);
    let emailUser = await this.findOne({ email: user.email });
    if (emailUser) {
        resp.msg = "Email is Already in Use";
    } else {
        let phoneUser = await this.findOne({ phone: user.phone });
        if (phoneUser) {
            resp.msg = "Phone is Already in Use";
        } else {
            await new this(user).save();
            resp.msg = "Register Success";
            resp.con = true;
        }
    }
    return resp;
}

UserSchema.statics.login = async function (data) {
    let resp = Helper.getResponse();
    let key = Object.keys(data)[0];
    let password = data.password;
    let phExistUser = await this.findOne({ [key]: data[key] });
    if (phExistUser) {
        if (phExistUser.status) {
            let passwordExist = Helper.comparePassword(password, phExistUser.password);
            if (passwordExist) {
                await RedisService.setObj(phExistUser._id, phExistUser);
                let user = await this.findOne({ _id: phExistUser._id });
                let userObj = user.toObject();
                userObj['roles'] = await UserRoleDB.all(userObj._id);
                userObj['permits'] = await UserPermitDB.all(userObj._id);
                delete userObj.password;
                userObj.token = await Helper.makeToken({ id: phExistUser._id });
                resp.con = true;
                resp.msg = "Login Success";
                resp.result = userObj;
            } else resp.msg = "Cridential Error";
        } else resp.msg = "You are banned!";
    } else resp.msg = "Cridential Error";
    return resp;
}

const User = mongoose.model('user', UserSchema);

module.exports = User