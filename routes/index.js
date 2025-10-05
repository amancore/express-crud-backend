import express from "express";
import {
	registerController,
	loginController,
	userController,
	refreshController,
	productController
} from "../controllers/index.js";
import auth from "../middlwares/auth.js";
const router = express.Router();
// already added the /api prefix in server.js
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.get("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);
router.post("/products", productController.store);
export default router;
