import dotenv from "dotenv";

dotenv.config();

export const env = {

port: Number(process.env.PORT ?? 2121),
nodeEnv: process.env.NODE_ENV ?? "development",
mongoURI: process.env.MONGODB_URI ?? ""

};