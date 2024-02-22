"use strict";
//my idea of a test is just to connect.. if anything sup, test go fail
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const assert_1 = __importDefault(require("assert"));
let redisClient; //gon be set after first test
const key = "test-kinikur", value = "random"; //for testing if redis idan is active
describe("RedisConnect", () => {
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield redisClient.del(key);
    }));
    before((done) => {
        _1.default.then(client => {
            redisClient = client;
            done();
        }).catch(done);
    });
    it("works", () => __awaiter(void 0, void 0, void 0, function* () {
        yield redisClient.set(key, value);
        //next, asserting
        const result = yield redisClient.get(key);
        assert_1.default.equal(result, value);
    }));
});
