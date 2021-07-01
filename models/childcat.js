const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChildCatSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    subcat: { type: Schema.Types.ObjectId, ref: 'subcat', required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

ChildCatSchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let subs = await this.find();
    let existCats = subs.filter((cat) => cat.name == body.name);
    if (existCats.length > 0) {
        resp.msg = "Child Category Name is already in use!";
    } else {
        let saveChild = await new this(body).save();
        resp.msg = "Child Category Successfully Created";
        resp.con = true;
        resp.result = saveChild;
    }
    return resp;
}

const ChildCat = mongoose.model('childcat', ChildCatSchema);

module.exports = ChildCat;
