const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const Password = require('../models/password.model');
const ApiError = require('../utils/ApiError');
const mongoosee = require('mongoose');

const storePassword = async (userId, password) => {
    try {
        const userWithPasswordHistory = await Password.findOne({ orgId: mongoosee.Types.ObjectId(userId) });

        if (!userWithPasswordHistory) {
            await Password.create({ orgId: mongoosee.Types.ObjectId(userId), password: [password] });
        } else {
            const lastThreePasswords = userWithPasswordHistory.password;
            if (lastThreePasswords.includes(password)) {
                return { status: false, message: "Password cannot be one of the last three passwords" };
            }

            userWithPasswordHistory.password.push(password);

            // if (userWithPasswordHistory.password.length > 3) {
            //     userWithPasswordHistory.password.shift();
            // }

            await userWithPasswordHistory.save();
        }

        return { status: true, message: "Password successfully stored" };
    } catch (error) {
        return { status: false, message: error };
    }
};




module.exports = {
    storePassword,
};
