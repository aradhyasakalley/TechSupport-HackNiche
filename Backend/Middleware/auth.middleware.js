const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: 'src/.env' });
const User = require('../Models/user.model');
const authentication = {
    verifyToken: async (req, res, next) => {
        try {
            let name = req.params.name
            if (typeof tkn === 'undefined')
                return res.status(401).json({ error: 'Unauthorized' });
                if (name) {
                    try {
                        const user = await User.find({username:user});
                        if (user) req.user = user;
                        else
                            return res
                                .status(400)
                                .json({ message: 'InvalidUser' });
                        next();
                    } catch (error) {
                        return res.status(400).json({ error: 'Invalid Token' });
                    }
                }
            }
        catch (error) {
            return res.status(401).send(error.message);
        }
    }
};

module.exports = authentication;