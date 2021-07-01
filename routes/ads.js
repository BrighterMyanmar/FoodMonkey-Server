const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateToken, validateRole } = require("../utils/validator");

const { Rest } = require('../utils/facade');
const Model = require('../models/ads');

const role = "Owner";

router.get("/", async (req, res) => await Rest.filter(Model, res));

router.route("/:id")
    .patch([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))

module.exports = router