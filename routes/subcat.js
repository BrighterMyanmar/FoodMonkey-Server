const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateBody, validateToken, validateRole } = require("../utils/validator");
const { SubCat, Rest } = require('../utils/facade');

const Model = require('../models/subcat');
const role = "Owner";

router.post("/", [validateBody(Schema.SubCatSave), validateToken(), validateRole(role)], async (req, res) => SubCat.add(res, req.body));
router.get("/", async (req, res) => Rest.filter(Model, res, {}, 'childs'));

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => Rest.patch(Model, res, req.params.id))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateBody(Schema.SubCatSave), validateToken(), validateRole(role)], async (req, res) => Rest.patch(Model, res, req.params.id, req.body))

module.exports = router