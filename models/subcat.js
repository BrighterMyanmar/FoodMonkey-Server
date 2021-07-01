const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubCatSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    childs: [{ type: Schema.Types.ObjectId, ref: 'childcat', default: [] }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

SubCatSchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let subs = await this.find();
    let existCats = subs.filter((cat) => cat.name == body.name);
    if (existCats.length > 0) {
        resp.msg = "Sub Category Name is already in use!";
    } else {
        let saveCat = await new this(body).save();
        resp.msg = "Sub Category Successfully Created";
        resp.con = true;
        resp.result = saveCat;
    }
    return resp;
}

const SubCat = mongoose.model('subcat', SubCatSchema);

module.exports = SubCat;