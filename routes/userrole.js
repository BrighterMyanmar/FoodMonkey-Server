const router = require("express-promise-router")();
const { Schema } = require("../utils/schema");
const { validateBody, validateParam, validateToken, validateRole } = require("../utils/validator");
const { UserRole, Rest } = require('../utils/facade');

const Model = require('../models/userrole');
const role = "Owner";

router.post("/", [validateBody(Schema.userAddRole), validateToken(), validateRole(role)], async (req, res) => UserRole.add(res, req.body));
router.post("/remove", [validateBody(Schema.userAddRole), validateToken(), validateRole(role)], async (req, res) => UserRole.remove(res, req.body));

// router.get("/:id", validateParam(Schema.id, 'id'), async (req, res) => await Rest.get(Model, res, req.params.id, 'roles'));
router.get("/:id", validateParam(Schema.id, 'id'), async (req, res) => await Rest.filter(Model, res, { userId: req.params.id }, 'roles'));


module.exports = router;