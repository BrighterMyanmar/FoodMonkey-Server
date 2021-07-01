const DB = require('../utils/db');
const Helper = require('./helper');

const UserDB = require('../models/user');
const PermitDB = require('../models/permit');
const RoleDB = require('../models/role');
const UserPermitDB = require('../models/userpermit');
const UserRoleDB = require('../models/userrole');
const CategoryDB = require('../models/category');
const SubCatDB = require('../models/subcat');
const ChildCatDB = require('../models/childcat');
const TagDB = require('../models/tag');
const DeliveryDB = require('../models/delivery');
const WarrantyDB = require('../models/warranty');
const ProductDB = require('../models/product');
const OrderDB = require('../models/order');
const OrderItemDB = require('../models/orderitems');
const FMCTOkenDB = require('../models/fmctoken');

module.exports = {
    User: {
        login: async (res, body) => {
            let resp = await UserDB.login(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        register: async (res, body) => {
            let resp = await UserDB.register(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    Permit: {
        add: async (res, body) => {
            let resp = await PermitDB.add(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    Role: {
        add: async (res, body) => {
            let resp = await RoleDB.add(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        addPermit: async (res, body) => {
            let roleId = body.roleId;
            let permitId = body.permitId;
            let resp = await RoleDB.addPermit(roleId, permitId);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        removePermit: async (res, body) => {
            let resp = await RoleDB.removePermit(body.roleId, body.permitId);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    UserRole: {
        add: async (res, body) => {
            let resp = await UserRoleDB.add(body.userId, body.roleId);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        remove: async (res, body) => {
            let resp = await UserRoleDB.remove(body.userId, body.roleId);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        hasRole: async (userId, roleId) => {
            return await UserRoleDB.hasRole(userId, roleId);
        }
    },
    UserPermit: {
        add: async (res, body) => {
            let resp = await UserPermitDB.add(body.userId, body.permitId);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        remove: async (res, body) => {
            let resp = await UserPermitDB.remove(body.userId, body.permitId);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        hasPermit: async (userId, permitId) => await UserPermitDB.hasPermit(userId, permitId),
        all: async (res, userId) => {
            let resp = { con: false, msg: "User Has no permission yet!", result: "" };
            resp.result = await UserPermitDB.all(userId);
            if (resp.result.length > 0) {
                resp.con = true;
                resp.msg = "All User's Permissions";
            }
            Helper.fMsg(res, resp.msg, resp.result);
        }
    },
    Category: {
        add: async (res, body) => {
            let resp = await CategoryDB.add(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    Tag: {
        add: async (res, body) => {
            let resp = await TagDB.add(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    SubCat: {
        add: async (res, body) => {
            let resp = await SubCatDB.add(body);
            if (resp.con) {
                let category = await CategoryDB.findOne({ _id: body.category });
                await CategoryDB.findByIdAndUpdate(category._id, { $push: { subs: resp.result._id } });
                Helper.fMsg(res, resp.msg, resp.result);
            } else throw new Error(resp.msg);
        }
    },
    ChildCat: {
        add: async (res, body) => {
            let resp = await ChildCatDB.add(body);
            if (resp.con) {
                let subcat = await SubCatDB.findOne({ _id: body.subcat });
                await SubCatDB.findByIdAndUpdate(subcat._id, { $push: { childs: resp.result._id } });
                Helper.fMsg(res, resp.msg, resp.result);
            } else throw new Error(resp.msg);
        }
    },
    Product: {
        add: async (res, body) => {
            let resp = await ProductDB.add(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    Delivery: {
        add: async (res, body) => {
            let resp = await DeliveryDB.add(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    Warranty: {
        add: async (res, body) => {
            let resp = await WarrantyDB.add(body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    },
    Order: {
        add: async (req, res) => {
            let currentUser = await Helper.getUserFromToken(req);
            let orderBody = {
                count: req.body.items.length,
                user: currentUser._id,
                total: req.body.total,
            };
            let orderResult = await new OrderDB(orderBody).save();
            let orderItems = [];
            for (item of req.body.items) {
                let product = await ProductDB.findOne({ _id: item.productId });
                item["order"] = orderResult._id;
                item["name"] = product.name;
                item["images"] = product.images;
                item["price"] = product.price;
                item["discount"] = product.discount;
                orderItems.push(item);
            }
            let itemsResult = await OrderItemDB.insertMany(orderItems);
            for (item of itemsResult) {
                await OrderDB.findByIdAndUpdate(orderResult._id, { $push: { items: item._id } });
            }
            let returnOrder = await OrderDB.find({ _id: orderResult._id }).populate('items');
            Helper.fMsg(res, "Order Accepted", returnOrder);
        }
    },
    FMCToken: {
        add: async (res, body) => {
            let tokenSave = await new FMCTOkenDB(body).save();
            if (tokenSave) Helper.fMsg(res, "FMC Token Saved!", tokenSave);
            else throw new Error(resp.msg);
        }
    },
    Rest: {
        filter: async (Model, res, filter = {}, populateFields = '', skip = 0) => {
            let CurrentTB = new DB(Model);
            let skipCount = Number(skip) == 0 ? 1 : Number(skip) * Number(process.env.LIMIT);
            let resp = await CurrentTB.filter(filter, populateFields, skipCount);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        get: async (Model, res, id, populateFields = '') => {
            let CurrentTB = new DB(Model);
            let resp = await CurrentTB.get(id, populateFields);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        patch: async (Model, res, id, body) => {
            let CurrentTB = new DB(Model);
            let resp = await CurrentTB.patch(id, body);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        },
        drop: async (Model, res, id) => {
            let CurrentTB = new DB(Model);
            let resp = await CurrentTB.drop(id);
            if (resp.con) Helper.fMsg(res, resp.msg, resp.result);
            else throw new Error(resp.msg);
        }
    }
}