import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { User } from "../../models/index.js";
const userController = {
	async me(req, res, next) {
		// get user id from the token
		try {
			// fetch user from database
			const user = await User.findOne({ _id: req.user._id }).select("-password -__v -createdAt -updatedAt");
			if (!user) {
				return next(CustomErrorHandler.unAuthorized("User not found"));
			}
			res.json(user);
		} catch (err) {
			return next(err);
		}
	},
};

export default userController;
 