import { registerAs } from "@nestjs/config";

export default registerAs('key', () => ({
    access: process.env.ACCESS_KEY,
    refresh: process.env.REFRESH_KEY
}));