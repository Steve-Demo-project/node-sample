const User = require('../models/users');
const httpStatus = require('http-status');
var jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/vars");
const helper = require('../helpers/user')

exports.signin = async (req, res, next) => {
    try {
        console.log('register')
        let body = req.body;
        if (!req.body.userName || !req.body.password) {
            res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ success: false, message: 'Please enter username and password.' });
        }
        const user = await User.findOne({userName:body.userName});
        console.log("))))",user)
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send({ success: false, message: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            helper.comparePassword(req.body.password, user.password,function (err, isMatch) {
            //    const isMatch = await bcrypt.compare(req.body.password, user.password);
            //     console.log("isMatch",isMatch)
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), jwtSecret);
                    // return the information including token as JSON
                    res.status(httpStatus.OK).json({ success: true,message: "Successfully loggedIn", token: token, user: user });
                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({ success: false, message: 'Authentication failed. Wrong password.' });
                }
            });
        }
        // return res.status(httpStatus.OK).json({ message: "Successfully loggedIn",user:user });

    } catch (error) {
        console.log(error);
        return res.send(error);
    }
};



