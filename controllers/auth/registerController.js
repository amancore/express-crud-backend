import Joi from "joi";
import { RefreshToken, User } from "../../models/index.js";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { REFRESH_SECRET } from "../../config/index.js";

const registerController = {
	async register(req, res, next) {
		// 1. validate the request
		const registerSchema = Joi.object({
			name: Joi.string().min(3).max(30).required(),
			email: Joi.string().email().required(),
			password: Joi.string()
				.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
				.required(),
			repeat_password: Joi.ref("password"),
		});

		const { error } = registerSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		// 2. check if the user already exists
		try {
			const exist = await User.exists({ email: req.body.email });
			if (exist) {
				return next(
					CustomErrorHandler.alreadyExists("This email is already taken")
				);
			}
		} catch (err) {
			return next(err);
		}
		// 3. hash the password
		const { name, email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10
		// prepare the model
		const user = new User({
			name,
			email,
			password: hashedPassword,
		});
		// 4. store the user in the database
		let access_token;
		let refresh_token;
		try {
			const result = await user.save();
			console.log(result);
			// token - json web token
			access_token = JwtService.sign({ _id: result._id, role: result.role });
			refresh_token = JwtService.sign(
				{ _id: result._id, role: result.role },
				"1y",
				REFRESH_SECRET
			);

			// make the database entry for refresh token and whitelist it
			await RefreshToken.create({ token: refresh_token });
		} catch (err) {
			return next(err);
		}
		// console.log(access_token, refresh_token);
		// 5. send a response
		res.json({ access_token, refresh_token });
	},
};

export default registerController;
