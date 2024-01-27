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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const validateCpf_1 = require("./validateCpf");
const INVALID_CPF = -1;
const INVALID_EMAIL = -2;
const INVALID_NAME = -3;
const ACCOUNT_ALREADY_EXISTS = -4;
const INVALID_CARPLATE = -5;
function signup(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = (0, pg_promise_1.default)()("postgres://postgres:postgres@localhost:5432/postgres");
        try {
            const [account] = yield connection.query("select * from cccat15.account where email = $1", [input.email]);
            if (account)
                return ACCOUNT_ALREADY_EXISTS;
            if (isNameInvalid(input.name))
                return INVALID_NAME;
            if (isEmailInvalid(input.email))
                return INVALID_EMAIL;
            if (isInvalidCPF(input.cpf))
                return INVALID_CPF;
            return registerAccount(account, connection);
        }
        finally {
            yield connection.$pool.end();
        }
    });
}
exports.signup = signup;
function isInvalidCPF(cpf) {
    return !(0, validateCpf_1.validateCpf)(cpf);
}
function isEmailInvalid(email) {
    return !email.match(/^(.+)@(.+)$/);
}
function isNameInvalid(name) {
    return !name.match(/[a-zA-Z] [a-zA-Z]+/);
}
function registerAccount(account, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = crypto_1.default.randomUUID();
        if (account.isDriver && isInvalidCarplate(account.carPlate))
            return INVALID_CARPLATE;
        yield connection.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
        const obj = {
            accountId: id
        };
        return obj;
    });
}
function isInvalidCarplate(carPlate) {
    return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
}
