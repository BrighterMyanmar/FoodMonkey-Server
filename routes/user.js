const router = require("express-promise-router")();
const { Schema } = require("../utils/schema");
const { validateBody, validateParam, validateToken, validateRole } = require("../utils/validator");

const { User, Rest } = require("../utils/facade");
const Model = require('../models/user');

router.post("/register", validateBody(Schema.register), async (req, res) => await User.register(res, req.body));
router.post('/', async (req, res) => await User.login(res, req.body));

router.get('/', async (req, res) => await Rest.filter(Model, res));
router.post('/filter', [validateToken(), validateRole("Owner")], async (req, res, next) => await Rest.filter(Model, res, req.body));

router.route("/:id")
    .get([validateParam(Schema.id, "id"), validateToken(), validateRole("Owner")], async (req, res) => await Rest.get(Model, res, req.params.id))
    .patch([validateParam(Schema.id, "id"), validateToken(), validateRole("Owner")], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))
    .delete([validateParam(Schema.id, "id"), validateToken(), validateRole("Owner")], async (req, res) => await Rest.drop(Model, res, req.params.id));

module.exports = router;

/*
    // Remain
let forgetPassword = async (req, res, next) => {
    let userPhone = req.body.phone;
    let user = await UserDB.findOne({ phone: userPhone });
    if (user) {
        let otpPhone = Helper.formatPhoneNumber(user.phone);
        let otpCode = ("" + Math.random()).substring(2, 8);

        let userProfile = await ProfileService.findOne({ user: user._id });
        let uP = await ProfileService.findByIdAndUpdate(userProfile._id, { otp: otpCode });
        await ProfileService.findOne({ _id: uP._id });
        await OtpService.sendOTP(res, otpPhone, otpCode);
    } else throw new Error("Your phone is not registered!");
}

let verifyOtp = async (req, res, next) => {
    let otp = req.body.otp;
    let phone = req.body.phone;

    let user = await UserDB.findOne({ phone: phone });
    if (user) {
        let userProfile = await ProfileService.findOne({ otp: otp });
        if (userProfile) {
            let uPro = userProfile.toObject();
            let token = Helper.makeToken(uPro);
            await ProfileService.findByIdAndUpdate(userProfile._id, { otp: 0 });

            Helper.fMsg(res, "Use this token to change your password", token);
        } else throw new Error("OTP verification fail!");
    } else throw new Error("Your phone is not registered!");
}

let changePassword = async (req, res, next) => {
    let userProfile = await Helper.verifyToken(req);
    let password = Helper.encodePassword(req.body.password);
    if (userProfile) {
        let user = await UserDB.findOne({ _id: userProfile.user });
        if (user) {
            await UserDB.findByIdAndUpdate(user._id, { password: password });
            Helper.fMsg(res, "Password Change Success, Please Login Again");
        } else throw new Error("Creditial Error!");
    } else throw new Error("Creditial Error!");
}

let bikerAdd = async (req, res, next) => {
    req.body.password = Helper.encodePassword(req.body.password);
    let result = await new UserDB(body).save();
    Helper.fMsg(res, "Biker Create Success", result);
}
*/