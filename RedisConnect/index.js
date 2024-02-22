"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { createClient } = require("redis");
//.env config outta been called by dotenv.config()
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");
const client = createClient(REDIS_PORT, REDIS_HOST);
client.on("connect", () => console.log("Redis idan is active!"));
client.on("ready", () => console.log("Redis idan is ready ohh"));
client.on("error", err => {
    console.error("Redis error!", err);
    process.exit(2);
});
/*didn't want to explicitly throw the err since normal nodejs behavior required that the err be thrown if no error callback,
however, redis does this thing were it continuously throws the error time-and-again..*/
const redisClientPromise /*IIFE*/ = (() => __awaiter(void 0, void 0, void 0, function* () { return yield client.connect(); }))();
exports.default = redisClientPromise;
module.exports = redisClientPromise;
