"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateCpf_1 = require("../src/validateCpf");
test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("Deve testar se o cpf é válido: %s", function (cpf) {
    const isValid = (0, validateCpf_1.validateCpf)(cpf);
    expect(isValid).toBe(true);
});
test.each([
    "8774824880",
    null,
    undefined,
    "11111111111"
])("Deve testar se o cpf é inválido: %s", function (cpf) {
    const isValid = (0, validateCpf_1.validateCpf)(cpf);
    expect(isValid).toBe(false);
});
