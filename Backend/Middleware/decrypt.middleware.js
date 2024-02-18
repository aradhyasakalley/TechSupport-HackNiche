const { decrypt } = require('./../utilities/utils');

const decryptData = (req, res, next) => {
    req.body = decrypt(req.body.data);
    next();
};

module.exports = decryptData;