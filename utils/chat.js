const RedisService = require('./redis');
const UnreadMsgDB = require('../models/unread');
const MessageDB = require('../models/message');

let liveUser = async (socketId, user) => {
    user['socketId'] = socketId;
    await RedisService.setObj(socketId, user._id);
    await RedisService.setObj(user._id, user);
}

let inttialize = async (io, socket) => {
    await liveUser(socket.id, socket.userData);
    await sendUnreadMsg(socket);
    socket.on('message', async (data) => incommingMessage(io, socket, data));
    socket.on('load', async (skip) => loadMoreMessage(socket, skip));
    socket.on('loadUserMsg', async (data) => loadUserMessage(socket, data));
    socket.on("publish", async (data) => bikerPublishGeo(socket, data, io));
    socket.on('disconnect', async () => disconnectSocket(socket));
}

let incommingMessage = async (io, socket, message) => {
    let sm = await new MessageDB(message).save();
    let msgResult = await MessageDB.findOne({ _id: sm._id }).populate('from to', 'name _id');

    let toUser = await RedisService.getObj(message.to);
    if (toUser) {
        let toSocket = io.of("/chat").connected[toUser.socketId];
        if (toSocket) {
            toSocket.emit('message', msgResult);
        }
    } else {
        let unReadSave = new UnreadMsgDB({ from: message.from, to: message.to });
        await unReadSave.save();
    }
    socket.emit('message', msgResult);
}

let bikerPublishGeo = async (socket, data, io) => {
    let publisherId = socket.userData._id;
    console.log("Publisher ", publisherId);
    console.log("Subscribers ", data.subscribers);
    await RedisService.setObj(publisherId, data);
    data.subscribers.forEach(async (subscriber) => {
        let toUser = await RedisService.getObj(subscriber);
        if (toUser) {
            let toSocket = io.of("/chat").connected[toUser.socketId];
            if (toSocket) {
                toSocket.emit('geo', data);
            }
        } else {
            console.log("User not found!");
        }
    });
    socket.emit('done', { con: true, publisher: publisherId, data: data });
}

let disconnectSocket = async (socket) => {
    let userId = await RedisService.getObj(socket.id);
    await RedisService.dropObj(socket.id);
    // use only user Logout
    // await RedisService.dropObj(userId);
}

let loadUserMessage = async (socket, data) => {
    let messages = await MessageDB.find({ $or: [{ from: data.userId }, { to: data.userId },] }).skip(Number(data.skip)).populate('from to', 'name _id');
    socket.emit('messages', messages);
}
let loadMoreMessage = async (socket, skip) => {
    let userId = await RedisService.getObj(socket.id);
    let messages = await MessageDB.find({ $or: [{ from: userId }, { to: userId },] }).skip(Number(skip)).populate('from to', 'name _id');
    socket.emit('messages', messages);
}

let sendUnreadMsg = async (socket) => {
    let userId = await RedisService.getObj(socket.id);
    let unreads = await UnreadMsgDB.find({ to: userId });
    if (unreads.length > 0) {
        unreads.forEach(async (unread) => {
            await UnreadMsgDB.findByIdAndDelete(unread._id);
        });
    }
    socket.emit('welcome', { msg: "Good Day by Mr.bolt!", unreads: unreads.length });
}

module.exports = {
    inttialize
}