const Helper = require("../utils/helper");
const router = require("express-promise-router")();
const GalleryDB = require("../models/gallery");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { validateToken, validateRole } = require("../utils/validator");

const role = "Owner";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let filename = file.originalname.split(".")[0];
        let fileExt = file.originalname.split(".")[1]
        cb(null, filename + "_" + Date.now() + '.' + fileExt);
    }
});
var upload = multer({ storage: storage });

router.post("/", upload.single('photo'), async (req, res, next) => {
    let path = `${process.env.IP_ADDRESS}/${req.file.destination}${req.file.filename}`;
    let gallery = {
        name: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        link: path,
    }
    let saveGallery = new GalleryDB(gallery)
    let galleryResult = await saveGallery.save();
    Helper.fMsg(res, "Gallery Save", galleryResult)
});

router.post("/files", [validateToken(), validateRole("Owner"), upload.array('photos')], async (req, res, next) => {
    let filetDatas = [];
    for (ind in req.files) {
        let file = req.files[ind];
        let path = `${process.env.IP_ADDRESS}/${file.destination}${file.filename}`;
        let gallery = {
            name: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            link: path,
        }
        filetDatas.push(gallery)
    }
    let saveFiles = await GalleryDB.insertMany(filetDatas);
    Helper.fMsg(res, "Galleries save", saveFiles);
});

router.get("/:skip", async (req, res, next) => {
    // let galleries = await GalleryDB.find({ name: { $regex: "^s_" } }).sort({ created: -1 }).skip(Number(req.params.skip) * Number(process.env.LIMIT)).limit(Number(process.env.LIMIT));
    let skipCount = Number(req.params.skip) == 0 ? 1 : Number(req.params.skip) * Number(process.env.LIMIT);
    let galleries = await GalleryDB.find({}).sort({ created: -1 }).skip(skipCount).limit(Number(process.env.LIMIT));
    // Helper.fMsg(res, "All Galleries", { "galleries": galleries, counts: await GalleryDB.countDocuments({ name: { $regex: "^s_" } }) });
    let docCounts = await GalleryDB.countDocuments();
    let dCount = Math.ceil(docCounts / Number(process.env.LIMIT));
    Helper.fMsg(res, "All Galleries", { "galleries": galleries, counts: dCount });
});

router.route("/:id").delete([validateToken(), validateRole("Owner")], async (req, res, next) => {
    let gallery = await GalleryDB.findOne({ _id: req.params.id });
    let filePath = path.resolve(__dirname, `../uploads/${gallery.name}`);
    fs.unlinkSync(filePath);
    await GalleryDB.findByIdAndDelete(gallery._id);
    Helper.fMsg(res, "Gallery Deleted");
});

module.exports = router