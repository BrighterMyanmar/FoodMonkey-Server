const mongoose = require('mongoose');
const { Schema } = mongoose;

let TagSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

TagSchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let subs = await this.find();
    let existCats = subs.filter((cat) => cat.name == body.name);
    if (existCats.length > 0) {
        resp.msg = "Tag Name is already in use!";
    } else {
        await new this(body).save();
        resp.msg = "Tag Successfully Created";
        resp.con = true;
    }
    return resp;
}

const Tag = mongoose.model('tag', TagSchema);
module.exports = Tag;