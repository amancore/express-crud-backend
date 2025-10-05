import Joi from "joi";
import { User,RefreshToken } from "../../models/index.js";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { REFRESH_SECRET } from "../../config/index.js";

const loginController = {
	async login(req, res, next) {
		// 1. validate the request
		const loginSchema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string()
				.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
				.required(),
		});

		const { error } = loginSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		// 2. check if the user exists
		const { email, password } = req.body;
		let user;
		let access_token;
		let refresh_token;
		try {
			user = await User.findOne({ email: email });
			if (!user) {
				return next(CustomErrorHandler.wrongCredentials("User not found"));
			}
			// 3. validate the password
			console.log(user, email, password);
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return next(
					CustomErrorHandler.wrongCredentials("Invalid email or password")
				);
			}
			// 4. generate jwt token
			access_token = JwtService.sign({ _id: user._id, role: user.role });
			refresh_token = JwtService.sign(
				{ _id: user._id, role: user.role },
				"1y",
				REFRESH_SECRET
			);

			// 5. send a response
			res.json({ access_token, refresh_token });
		} catch (err) {
			return next(err);
		}
	},
};

export default loginController;
