import mongoose from "mongoose";
const refreshTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		unique : true,
	}
}, {timestamps: true}); 
export default mongoose.model("RefreshToken", refreshTokenSchema, 'refreshTokens'); 
// this model is to store the refresh tokens in the database for whitelisting purpose