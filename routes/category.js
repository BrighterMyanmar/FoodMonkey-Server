const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateToken, validateRole, validateBody } = require("../utils/validator");
const Helper = require('../utils/helper');

const { Category, Rest } = require('../utils/facade');
const Model = require('../models/category');
const role = "Owner";

router.post("/", [validateBody(Schema.catrgorySave), validateToken(), validateRole(role)], async (req, res) => await Category.add(res, req.body));
router.get("/", async (req, res) => {
    let cats = await Model.find({}).populate({
        path: 'subs',
        model: 'subcat',
        populate: {
            path: 'childs',
            model: 'childcat'
        }
    });
    Helper.fMsg(res, "All Categories", cats);
});

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(Model, res, req.params.id))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateBody(Schema.catrgorySave), validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))

module.exports = router