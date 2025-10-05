import Joi from "joi";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
import { RefreshToken } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { User } from "../../models/index.js";

const refreshController = {
	async refresh(req, res, next) {
		// validation
		const refreshSchema = Joi.object({
			refresh_token: Joi.string().required(),
		});
		const { error } = refreshSchema.validate(req.body);
		if (error) {
			return next(error);
		}

		// check in the database
		let refreshtoken;
		try {
			refreshtoken = await RefreshToken.findOne({
				token: req.body.refresh_token,
			});
			console.log("🚀 ~ refresh ~ refreshtoken:", refreshtoken);

			if (!refreshtoken) {
				return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
			}

			// vefify token
			let userId;
			try {
				const { _id } = await JwtService.verify(
					refreshtoken.token,
					REFRESH_SECRET
				);
				userId = _id;
			} catch (err) {
				return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
			}
			console.log("🚀 ~ refresh ~ userId:", userId);
			// token generate
			const user = User.findOne({ _id: userId });
			if (!user) {
				return next(CustomErrorHandler.unAuthorized("No user found!"));
			}
			const access_token = JwtService.sign({ _id: userId, role: user.role });
			const refresh_token = JwtService.sign(
				{ _id: userId, role: user.role },
				"1y",
				REFRESH_SECRET
			);
			// database whitelist
			await RefreshToken.create({ token: refresh_token });
			res.json({ access_token, refresh_token });
		} catch (err) {
			return next(new Error("Something went wrong" + err.message));
		}
		res.json({ status: 1 });
	},
};
export default refreshController;
