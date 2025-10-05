class CustomErrorHandler extends Error {
	constructor(status, msg) {
		super(msg);
		this.status = status;
		this.message = msg;
	}

	static alreadyExists(message = "Already Exists") {
		return new CustomErrorHandler(409, message); // 409 - conflict
	}
	static wrongCredentials(message = "Username or Password is wrong") {
		return new CustomErrorHandler(401, message); // 401 - unauthorized
	}
	static unAuthorized(message = "Unauthorized") {
		return new CustomErrorHandler(401, message); // 401 - unauthorized
	}
}

export default CustomErrorHandler;