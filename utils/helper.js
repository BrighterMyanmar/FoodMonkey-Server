const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RedisService = require("./redis");

let getToken = (req) => {
    if (req.headers.authorization) return req.headers.authorization.split(" ")[1];
    else throw new Error('Tokenization Error');
}

let getUserFromToken = async (req) => {
    let userId = jwt.verify(getToken(req), process.env.SECRET_KEY).id;
    return await RedisService.getObj(userId);
}

let verifyToken = async (req) => {
    let decodeData = jwt.verify(getToken(req), process.env.SECRET_KEY);
    console.log(decodeData);
    return decodeData;
}

let formatPhoneNumber = (phone) => {
    let removeFirstNumberPhone = phone.slice(1, phone.length);
    return "+95" + removeFirstNumberPhone;
}

let fMsg = (res, msg, result) => {
    res.status(200).json({ con: true, msg: msg, result: result });
}

let getSocketToken = async (socket) => {
    let token = socket.handshake.query.token;
    let userId = jwt.verify(token, process.env.SECRET_KEY);
    let user = await RedisService.getObj(userId.id);
    return user;
}
module.exports = {
    fMsg,
    getUserFromToken,
    formatPhoneNumber,
    verifyToken,
    getSocketToken,
    encodePassword: (password) => bcrypt.hashSync(password, 10),
    comparePassword: (plain, hash) => bcrypt.compareSync(plain, hash),
    makeToken: (payload) => jwt.sign(payload, process.env.SECRET_KEY),
    // makeToken: (payload) => jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' })
    getResponse : () => { return {con: false, msg: "", result: "" };}
}