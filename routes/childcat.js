const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateToken, validateRole, validateBody } = require("../utils/validator");
const { ChildCat, Rest } = require('../utils/facade');
const role = "Owner";

const Model = require('../models/childcat');

router.post("/", [validateBody(Schema.ChildCatSave), validateToken(), validateRole(role)], async (req, res) => ChildCat.add(res, req.body));
router.get("/", async (req, res) => Rest.filter(Model, res));

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => Rest.patch(Model, res, req.params.id))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateBody(Schema.ChildCatSave), validateToken(), validateRole(role)], async (req, res) => Rest.patch(Model, res, req.params.id, req.body))

module.exports = router