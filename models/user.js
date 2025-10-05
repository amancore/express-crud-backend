import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
	name: {
		type : String, required: true
	},
	email: {
		type : String , required: true, unique: true
	},
	password: {
		type : String, required: true
	},
	role: {
		type : String , default : 'customer'
	}
}, {timestamps: true});  // for the createdAt and updatedAt fields

export default mongoose.model("User", userSchema, 'users');  // third parameter is optional but its common practice to use plural of model name