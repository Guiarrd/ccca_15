"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signup_1 = require("../src/signup");
test("Deve retornar a conta criada ao informar credenciais válidas de um motorista", function () {
    const driverAccount = {
        name: "Fulano da Silva",
        email: "fulano@uber-fake.com",
        cpf: 97456321558,
        idDriver: true,
        carPlate: "ABC-1234"
    };
    const registeredAccount = (0, signup_1.signup)(driverAccount);
    registeredAccount.then((account) => {
        expect(account.accountId).toBe(1);
    }).catch((error) => {
        throw new Error(`Falha ao criar conta: ${error.message}`);
    });
});
