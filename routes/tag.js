const router = require('express-promise-router')();
const { Schema } = require("../utils/schema");
const { validateParam, validateBody, validateToken, validateRole } = require("../utils/validator");
const { Tag, Rest } = require('../utils/facade');

let role = "Owner";

const Model = require('../models/tag');

router.post("/", [validateBody(Schema.tagSave), validateToken(), validateRole(role)], async (req, res) => Tag.add(res, req.body));
router.get("/", async (req, res) => Rest.filter(Model, res));

router.route("/:id")
    .get(validateParam(Schema.id, 'id'), async (req, res) => Rest.get(Model, res, req.params.id))
    .delete([validateParam(Schema.id, 'id'), validateToken(), validateRole(role)], async (req, res) => Rest.drop(Model, res, req.params.id))
    .patch([validateParam(Schema.id, 'id'), validateBody(Schema.tagSave), validateToken(), validateRole(role)], async (req, res) => Rest.patch(Model, res, req.params.id, req.body))

module.exports = router
module.exports = router