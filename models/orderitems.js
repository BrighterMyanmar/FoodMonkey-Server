const mongoose = require('mongoose');
const { Schema } = mongoose;
const OrderItemSchema = new Schema({
    order: { type: Schema.Types.ObjectId, required: true },
    count: { type: Number, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, },
    images: { type: Array, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    status: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
});
const OrderItem = mongoose.model('orderItem', OrderItemSchema);

module.exports = OrderItem;
