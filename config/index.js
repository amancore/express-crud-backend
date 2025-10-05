import dotenv from "dotenv";
dotenv.config();

export const APP_PORT = process.env.APP_PORT;
export const DEBUG_MODE = process.env.DEBUG_MODE;
export const DB_URL = process.env.DB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_SECRET;