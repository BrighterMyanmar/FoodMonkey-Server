const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    subs: [{ type: Schema.Types.ObjectId, ref: 'subcat', default: [] }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

CategorySchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let categories = await this.find();
    let existCats = categories.filter((cat) => cat.name == body.name);
    if (existCats.length > 0) {
        resp.msg = "Category Name is already in use!";
    } else {
        await new this(body).save();
        resp.msg = "Category Successfully Created";
        resp.con = true;
    }
    return resp;
}

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;