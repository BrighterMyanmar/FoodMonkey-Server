const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: Array, required: true },
    features: { type: Array, required: true },
    imgcolors: { type: Array, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category' },
    subcat: { type: Schema.Types.ObjectId, ref: 'subcat' },
    childcat: { type: Schema.Types.ObjectId, ref: 'childcat' },
    tag: { type: Schema.Types.ObjectId, ref: 'tag' },
    desc: { type: String, required: true },
    detail: { type: String, required: true },
    discount: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    delivery: { type: Schema.Types.ObjectId, ref: 'delivery' },
    warranty: { type: Schema.Types.ObjectId, ref: 'warranty' },
    colors: { type: Array, required: true },
    size: { type: String, required: true },
    rating: { type: Number },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
})

ProductSchema.statics.add = async function (body) {
    let resp = { con: false, msg: "", result: "" };
    let subs = await this.find();
    let existCats = subs.filter((cat) => cat.name == body.name);
    if (existCats.length > 0) {
        resp.msg = "Product Name is already in use!";
    } else {
        await new this(body).save();
        resp.msg = "Product Successfully Created";
        resp.con = true;
    }
    return resp;
}

const Product = mongoose.model('product', ProductSchema)

module.exports = Product