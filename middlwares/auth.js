import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";
const auth = (req,res,next) => {
	let authHeader = req.headers.authorization;
	if (!authHeader) {
		return next(CustomErrorHandler.unAuthorized());
	}
	const token = authHeader.split(" ")[1];
	try {
		const {_id, role} = JwtService.verify(token);
		req.user = {_id, role};  
		next(); // normal middleware flow
	} catch (err) {
		return next(CustomErrorHandler.unAuthorized());
	}
}
export default auth;