import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SUGAR_URI = prod ? process.env["SUGAR_URI"] : process.env["SUGAR_URI_LOCAL"];


if (!SUGAR_URI) {
    if (prod) {
        logger.error("No sugar url string. Set SUGAR_URI environment variable.");
    } else {
        logger.error("No sugar urlstring. Set SUGAR_URI_LOCAL environment variable.");
    }
    process.exit(1);
}
