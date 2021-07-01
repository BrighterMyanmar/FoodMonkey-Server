const Helper = require('../utils/helper');

module.exports = class DB {

    constructor(Model) {
        this.Model = Model;
    }

    async save(res, body) {
        let dataResult = await new this.Model(body).save();
        Helper.fMsg(res, "Data Created", dataResult);
    };

    async get(id,populatefields = '') {
        let resp = Helper.getResponse();
        let role = await this.Model.findOne({ _id: id }).populate(populatefields).select("-password -__v");
        if (role) {
            resp.con = true;
            resp.msg = "Data";
            resp.result = role;
        }
        else resp.msg = "No Data with that id!";
        return resp;
    };

    async filter(filter, populatefields = '',skp,limit) {
        let resp = Helper.getResponse();
        let role = await this.Model.find(filter).skip(Number(skp)).limit(Number(process.env.LIMIT)).populate(populatefields).select("-password -__v");
        if (role) {
            resp.msg = "All";
            resp.con = true;
            resp.result = role;
        } else resp.msg = "No Data with that id!";
        return resp;
    };

    async drop(id) {
        let resp = Helper.getResponse();
        let role = await this.Model.findOne({ _id: id });
        if (role) {
            await this.Model.findByIdAndDelete(role._id);
            resp.con = true;
            resp.msg = "Data Deleted";
        } else resp.msg = "No Data with that id!";
        return resp;
    };

    async patch(id, body) {
        let resp = Helper.getResponse();
        let role = await this.Model.findByIdAndUpdate(id, body);
        if (role) {
            let r = await this.Model.findOne({ _id: id }).select("-password -__v");
            resp.con = true;
            resp.msg = "Data Updated";
            resp.result = r;
        } else {
            resp.msg = "Data Update Fail";
        }
        return resp;
    }

}