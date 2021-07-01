const router = require("express-promise-router")();
const { Schema } = require("../utils/schema");
const { validateBody, validateParam, validateToken, validateRole } = require("../utils/validator");
const { Role, Rest } = require('../utils/facade');

const Model = require('../models/role');
const role = "Owner";

router.post("/", [validateBody(Schema.role), validateToken(), validateRole(role)], async (req, res) => await Role.add(res, req.body));
router.post("/add/permit", [validateBody(Schema.roleAddPermit), validateToken(), validateRole(role)], async (req, res) => await Role.addPermit(res, req.body));
router.post("/remove/permit", [validateBody(Schema.roleAddPermit), validateToken(), validateRole(role)], async (req, res) => await Role.removePermit(res, req.body));

router.get("/", async (req, res) => await Rest.filter(Model, res));
router.post("/filter", [validateToken(), validateRole(role)], async (req, res) => await Rest.filter(Model, res, req.body));

router.route("/:id")
    .get(validateParam(Schema.id, "id"), async (req, res) => await Rest.get(Model, res, req.params.id, 'permits'))
    .patch([validateParam(Schema.id, "id"),validateToken(), validateRole(role)], async (req, res) => await Rest.patch(Model, res, req.params.id, req.body))
    .delete([validateParam(Schema.id, "id"), validateToken(), validateRole(role)], async (req, res) => await Rest.drop(Model, res, req.params.id))

module.exports = router;