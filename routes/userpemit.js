const router = require("express-promise-router")();
const { Schema } = require("../utils/schema");
const { validateBody, validateParam, validateToken, validateRole } = require("../utils/validator");
const { UserPermit, Rest } = require('../utils/facade');

const Model = require('../models/userpermit');
const role = "Owner";

router.post("/", [validateBody(Schema.userAddPermit), validateToken(), validateRole(role)], async (req, res) => await UserPermit.add(res, req.body));
router.post("/remove", [validateBody(Schema.userAddPermit), validateToken(), validateRole(role)], async (req, res) => await UserPermit.remove(res, req.body));

router.get("/:id", validateParam(Schema.id, 'id'), async (req, res) => await UserPermit.all(res, req.params.id));


module.exports = router;