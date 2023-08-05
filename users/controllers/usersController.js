const { generateAuthToken } = require("../../auth/Providers/jwt");
const { handleError } = require("../../utils/handleErrors");
const { comparePassword } = require("../helpers/bcrypt");
const normalizeUser = require("../helpers/normalizeUser");
const loginValidation = require("../models/joi/loginValidation");
const registerValidation = require("../models/joi/registerValidation");
const User = require("../models/mongoose/User");

const register = async (req, res) => {
	try {
		const user = req.body;
		const { email } = user;

		const { error } = registerValidation(user);
		if (error)
			return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

		const isUserExistInDB = await User.findOne({ email });
		if (isUserExistInDB) throw new Error("User already registered");

		const normalizedUser = normalizeUser(user);

		const userForBD = new User(normalizedUser);
		const userFromDB = await userForBD.save();
		res.send(userFromDB);
	} catch (error) {
		return handleError(res, 500, `Mongoose Error: ${error.message}`);
	}
};

const login = async (req, res) => {
	try {
		const user = req.body;
		const { email } = user;
		const { error } = loginValidation(user);
		if (error)
			return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

		const userInDb = await User.findOne({ email });
		if (!userInDb)
			throw new Error("Authentication Error: Invalid email or password");

		const isPasswordValid = comparePassword(user.password, userInDb.password);
		if (!isPasswordValid)
			throw new Error("Authentication Error: Invalid email or password");

		const { _id, isBusiness, isAdmin } = userInDb;
		const token = generateAuthToken({ _id, isBusiness, isAdmin });

		res.send(token);
	} catch (error) {
		const isAuthError =
			error.message === "Authentication Error: Invalid email or password";

		return handleError(
			res,
			isAuthError ? 403 : 500,
			`Mongoose Error: ${error.message}`
		);
	}
};

exports.register = register;
exports.login = login;