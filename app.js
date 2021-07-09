require("dotenv").config();
const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser'),
    path = require('path'),
    Helper = require('./utils/helper'),
    mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

/*********** Delete Publishing  ******************/
io.origins('*:*');
cors = require('cors');
app.options('*', cors());

app.use(cors());
app.use(bodyParser.json());

const adsRoute = require('./routes/ads');
const userRoute = require('./routes/user');
const roleRoute = require('./routes/role');
const permitRoute = require('./routes/permit');
const userRoleRoute = require('./routes/userrole');
const userPermitRoute = require('./routes/userpemit');
const galleryRote = require('./routes/gallery');
const CategoryRoute = require('./routes/category');
const SubCatRoute = require('./routes/subcat');
const ChildCatRoute = require('./routes/childcat');
const TagRoute = require('./routes/tag');
const DeliveryRoute = require('./routes/delivery');
const WarrantyRoute = require('./routes/warranty');
const ProductRoute = require('./routes/product');
const OrderRoute = require('./routes/order');
const ApiRoute = require('./routes/api');

app.use('/ads', adsRoute);
app.use('/user', userRoute);
app.use('/role', roleRoute);
app.use('/permit', permitRoute);
app.use('/userrole', userRoleRoute);
app.use('/userpermit', userPermitRoute);
app.use('/gallery', galleryRote);
app.use('/category', CategoryRoute);
app.use('/subcat', SubCatRoute);
app.use('/childcat', ChildCatRoute);
app.use('/tag', TagRoute);
app.use('/delivery', DeliveryRoute);
app.use('/warranty', WarrantyRoute);
app.use('/product', ProductRoute);
app.use('/order', OrderRoute);
app.use('/api', ApiRoute);

app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));

app.use((req, res, next) => {
    let err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    let error = app.get('env') == 'development' ? err : {};
    error.status = err.status || 303;
    res.status(error.status).json(
        { con: false, msg: error.message, result: error.message })
});

server.listen(3000, () => console.log(`Server is running at port ${process.env.PORT}`));


io.of("/chat").use(async (socket, next) => {
    let user = await Helper.getSocketToken(socket);
    if (user == null) {
        socket.emit('error', { con: false, "message": "Creditial Error" })
    } else {
        socket.userData = user;
        next();
    }
}).on('connection', (socket) => {
    require("./utils/chat").inttialize(io, socket);
});

let migrateTest = async () => {
    let migrator = require('./migrations/migrator');
    // await migrator.DataBackup();
    // await migrator.DataMigrate();
}
// migrateTest();

let rolePermitTest = async () => {
    let { UserRole } = require('./utils/facade');
    let UserPermitDB = require('./models/userpermit');
    // console.log(await UserRole.hasRole("604c9a27e6c4e10cc21d121d", "604c9a10bee8ba0cc0e7ccdd"));
    // console.logo(await UserPermitDB.hasPermit("604c9a27e6c4e10cc21d121d", "604c9a10bee8ba0cc0e7ccde"));
}

let pusherTest = async () => {
    // let token = "eEPgZ6DUT1KY4qwWwgeCtZ:APA91bGtcmK10wdFikDzgjc5lLOdidjKBXnUSS6NAjTZZfdRY4YUcsT6akq5gqMChe-TKkJu9VpuKCmhklR41CCCpFjL9fEh0bM7z9ChqugF69nj7mujRYfOy6lTSRLx3aHR8310hYm8";
    // require('./utils/pusher').push(token, "New Test!");
    // require('./utils/pusher').broadcast("New_Products","The more the marrier!");
    // require('./utils/pusher').broadcast("Big_Promotion", { score: '850', time: '2:45' });
    // require('./utils/pusher').broadcast("Special_Discount", { score: '850', time: '2:45' });
    // require('./utils/pusher').broadcast("Order_Shipping", { score: '850', time: '2:45' });
    // require('./utils/pusher').broadcast("Order_Shipping_Done", { score: '850', time: '2:45' });
    // require('./utils/pusher').broadcast("Announcement", { score: '850', time: '2:45' });
}
// test();
