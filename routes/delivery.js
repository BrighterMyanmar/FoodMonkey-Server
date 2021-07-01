const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateBody, validateToken, validateRole } = require("../utils/validator");

const { Delivery, Rest } = require('../utils/facade');
const role = "Owner";

const Model = require('../models/delivery');

router.post("/", [validateBody(Schema.deliverySave), validateToken(), validateRole(role)], async (req, res) => await Delivery.add(res, req.body));
router.get("/", async (req, res) => await Rest.filter(Model, res));

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(Model, res, req.params.id))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateBody(Schema.deliverySave), validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))

module.exports = router