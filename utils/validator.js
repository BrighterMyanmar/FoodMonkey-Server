const Helper = require('../utils/helper');
const UserRoleDB = require('../models/userrole');
const RoleDB = require('../models/role');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            let result = schema.validate(req.body);
            // if (result.error) throw new Error("Data Validation Error");
            if (result.error) console.log(result.error);
            else next();
        }
    },
    validateParam: (schema, name) => {
        return (req, res, next) => {
            let result = schema.validate(req.params[name]);
            if (result.error) throw new Error('Parameter Validation Error');
            else next();
        }
    },
    validateToken: () => {
        return async (req, res, next) => {
            let user = await Helper.getUserFromToken(req);
            if (user) next();
            else throw new Error('Token validation error');
        }
    },
    validateOPT: () => {
        return async (req, res, next) => {
            let user = await Helper.verifyToken(req);
            if (user) next();
            else throw new Error('Token validation error');
        }
    },
    validateLevel: (num) => {
        return async (req, res, next) => {
            let user = await Helper.getUserFromToken(req);
            if (user.level <= num) next();
            else throw new Error("You don't have that permission");
        }
    },
    validateRole: (roleName) => {
        return async (req, res, next) => {
            let user = await Helper.getUserFromToken(req);
            let role = await RoleDB.getRoleByName(roleName);
            
            if (await UserRoleDB.hasRole(user._id, role._id)) next();
            else throw new Error("You don't have this permission");
        }
    }
}