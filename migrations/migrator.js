const fs = require('fs');

const AdsDB = require('../models/ads');

const PermitDB = require('../models/permit');
const RoleDB = require('../models/role');
const UserDB = require('../models/user');
const UserPermitDB = require('../models/userpermit');
const UserRoleDB = require('../models/userrole');


const GalleryDB = require('../models/gallery');
const CategoryDB = require('../models/category');
const SubCatDB = require('../models/subcat');
const ChildCatDB = require('../models/childcat');
const TagDB = require('../models/tag');
const DeliveryDB = require('../models/delivery');
const WarrantyDB = require('../models/warranty');

const ProductDB = require('../models/product');
const OrderDB = require('../models/order');
const OrderItemsDB = require('../models/orderitems');

const FMCTokenDB = require('../models/fmctoken');
const MessageDB = require('../models/message');
const UnreadDB = require('../models/unread');



const Permit = {
    backup: async (DB, fileName) => {
        let data = await DB.find();
        await writeFile("./migrations/" + fileName, data);
        console.log("Backup Done", fileName);
    },
    add: async (DB, fileName) => {
        let data = await readFile("./migrations/" + fileName);
        let dataSaveResult = await DB.insertMany(data);
        console.log("Data Migrate Done", fileName, dataSaveResult);
    }
}


const DataBackup = async () => {
    await Permit.backup(AdsDB, "./ads.json");
    await Permit.backup(PermitDB, "./permits.json");
    await Permit.backup(RoleDB, "./roles.json");
    await Permit.backup(UserDB, "./users.json");
    await Permit.backup(UserPermitDB, "./userpermits.json");
    await Permit.backup(UserRoleDB, "./userRoles.json");

    await Permit.backup(GalleryDB, "./galleries.json");
    await Permit.backup(CategoryDB, "./categories.json");
    await Permit.backup(SubCatDB, "./subcats.json");
    await Permit.backup(ChildCatDB, "./childcats.json");
    await Permit.backup(TagDB, "./tags.json");
    await Permit.backup(DeliveryDB, "./deliveries.json");
    await Permit.backup(WarrantyDB, "./warranties.json");

    await Permit.backup(ProductDB, "./products.json");
    await Permit.backup(OrderDB, "./orders.json");
    await Permit.backup(OrderItemsDB, "./orderitems.json");

    await Permit.backup(FMCTokenDB, "./fmctokens.json");
    await Permit.backup(MessageDB, "./messages.json");
    await Permit.backup(UnreadDB, "./unread.json");

}
const DataMigrate = async () => {
    await Permit.add(AdsDB, "./ads.json");
    await Permit.add(PermitDB, "./permits.json");
    await Permit.add(RoleDB, "./roles.json");
    await Permit.add(UserDB, "./users.json");
    await Permit.add(UserPermitDB, "./userpermits.json");
    await Permit.add(UserRoleDB, "./userRoles.json");

    await Permit.add(GalleryDB, "./galleries.json");
    await Permit.add(CategoryDB, "./categories.json");
    await Permit.add(SubCatDB, "./subcats.json");
    await Permit.add(ChildCatDB, "./childcats.json");
    await Permit.add(TagDB, "./tags.json");
    await Permit.add(DeliveryDB, "./deliveries.json");
    await Permit.add(WarrantyDB, "./warranties.json");

    await Permit.add(ProductDB, "./products.json");
    await Permit.add(OrderDB, "./orders.json");
    await Permit.add(OrderItemsDB, "./orderitems.json");

    await Permit.add(FMCTokenDB, "./fmctokens.json");
    await Permit.add(MessageDB, "./messages.json");
    await Permit.add(UnreadDB, "./unread.json");
}

const writeFile = async (fileName, data) => await fs.writeFileSync(fileName, JSON.stringify(data), 'utf8');
const readFile = async (fileName) => JSON.parse(await fs.readFileSync(fileName, "utf8"));

module.exports = {
    DataBackup,
    DataMigrate,
}