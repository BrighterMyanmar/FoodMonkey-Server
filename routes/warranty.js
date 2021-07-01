const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateBody, validateToken, validateRole } = require("../utils/validator");
const { Warranty, Rest } = require('../utils/facade');
const role = "Owner";

const Model = require('../models/warranty');

router.post("/", [validateBody(Schema.warrantySave), validateToken(), validateRole(role)], async (req, res) => await Warranty.add(res, req.body));
router.get("/", async (req, res) => await Rest.filter(Model, res));

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(Model, res, req.params.id))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))

module.exports = router