import { createClient } from "redis"
import configService from "../config/config.service.js";

export const client = createClient({
    url: configService.redisUri
});

client.on("error", function (err) {
    console.error("Redis Client Error:", err);
});



