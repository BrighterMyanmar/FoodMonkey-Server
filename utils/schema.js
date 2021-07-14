const Joi = require("joi");

let regy = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

module.exports = {
    Schema: {
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        skip: Joi.number().optional().default(0),
        phone: Joi.object({
            phone: Joi.string().regex(/^\d{7,11}$/).required()
        }),
        password: Joi.object({
            password: Joi.string().min(8).regex(regy).required(),
        }),
        otpVerify: Joi.object({
            phone: Joi.string().regex(/^\d{7,11}$/).required(),
            otp: Joi.number().min(6).required()
        }),
        login: Joi.object({
            // phone: Joi.string().regex(/^\d{7,11}$/).required(),
            phone: Joi.string().min(7).max(11).required(),
            password: Joi.string().min(8).required(),
            // password: Joi.string().min(8).regex(regy).required(),
        }),
        role: Joi.object({
            name: Joi.string().required(),
            level: Joi.number().required(),
        }),
        roleAddPermit: Joi.object({
            permitId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }),
        userAddRole: Joi.object({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }),
        userAddPermit: Joi.object({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            permitId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }),
        permit: Joi.object({
            name: Joi.string().required(),
        }),
        register: Joi.object({
            name: Joi.string().min(4).required(),
            email: Joi.string().min(9).required(),
            phone: Joi.string().min(7).max(11).required(),
            // phone: Joi.string().regex(/^\d{7,11}$/).required(),
            // password: Joi.string().min(8).regex(regy).required(),
            password: Joi.string().min(8).required(),
            // fcmtoken: Joi.string().optional()
        }),
        add: Joi.object({
            name: Joi.string().min(4).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().regex(/^\d{7,11}$/).required(),
            password: Joi.string().min(8).regex(regy).required(),
            role: Joi.string().required(),
            level: Joi.number().required(),
        }),
        tagSave: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required()
        }),
        catrgorySave: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required(),
        }),
        SubCatSave: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required(),
            category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        ChildCatSave: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required(),
            category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            subcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }),
        deliverySave: Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            duration: Joi.string().required(),
            image: Joi.string().required(),
            remarks: Joi.array().optional()
        }),
        warrantySave: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required(),
            remarks: Joi.array().optional()
        }),
        productSave: Joi.object({
            name: Joi.string().required(),
            brand: Joi.string().required(),
            price: Joi.number().required(),
            images: Joi.array().required(),
            features: Joi.array().required(),
            imgcolors: Joi.array().required(),
            category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            subcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            childcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            tag: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            desc: Joi.string().required(),
            detail: Joi.string().required(),
            discount: Joi.number().optional(),
            colors: Joi.array().required(),
            size: Joi.string().required(),
            delivery: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            warranty: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }),
        orderSave: Joi.object({
            // user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            total: Joi.number().required(),
            // biker: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            items: Joi.array().required(),
        }),
    }
}