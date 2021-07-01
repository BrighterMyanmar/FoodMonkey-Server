const router = require("express-promise-router")();
const { Schema } = require("../utils/schema");
const { validateBody, validateParam, validateToken, validateRole } = require("../utils/validator");
const { Permit, Rest } = require('../utils/facade');

const Model = require('../models/permit');
const role = "Owner";

router.post("/", [validateBody(Schema.permit), validateToken(), validateRole(role)], async (req, res) => await Permit.add(res, req.body));

router.get("/", async (req, res, next) => await Rest.filter(Model, res));
router.post("/filter", [validateToken(), validateRole(role)], async (req, res, next) => await Rest.filter(Model, res, req.body));

router.route("/:id")
    .get(validateParam(Schema.id, "id"), async (req, res) => await Rest.get(Model, res, req.params.id))
    .patch([validateParam(Schema.id, "id"), validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))
    .delete([validateParam(Schema.id, "id"), validateToken(), validateRole(role)], async (req, res) => await Rest.drop(Model, res, req.params.id))


module.exports = router;