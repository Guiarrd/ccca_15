import { AccountDAODataBase } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import MailerGateway from "../src/MailerGateway";
import Signup from "../src/Signup";
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    const accountDAO = new AccountDAODataBase();
    signup = new Signup(accountDAO);
    getAccount = new GetAccount(accountDAO);
})

test("Deve criar a conta do motorista", async () => {
    const input = {
        name: "Fulano da Silva",
        email: `fulano${Math.random()}@uber-fake.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isDriver: true
    }

    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.car_plate).toBe(input.carPlate);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
});

test("Deve criar a conta do passageiro", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }

    const outputSignup = await signup.execute(input);
    expect(outputSignup).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("Não deve criar a conta se o nome for inválido", async () => {
    const input = {
        name: "Ciclano",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "97456321558",
        isDriver: true,
        carPlate: "ABC1234"
    }
    
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar a conta se o e-mail for inválido", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}`,
        cpf: "97456321558",
        isPassenger: true
    }
    
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar a conta se o cpf for inválido", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "974563215",
        isPassenger: true
    }

    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar a conta se a conta já existe", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Não deve criar a conta se a placa do carro for inválida", async () => {
    const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isDriver: true
	};

    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});

test.skip("Deve criar a conta do passageiro stub", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }

   const saveStub = sinon.stub(AccountDAODataBase.prototype, "save").resolves()
   const getByEmailStub = sinon.stub(AccountDAODataBase.prototype, "getByEmail").resolves()
   const getByIdStub = sinon.stub(AccountDAODataBase.prototype, "getById").resolves(input)

    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    saveStub.restore();
    getByEmailStub.restore();
    getByIdStub.restore();
});

test.skip("Deve criar a conta do passageiro spy", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }

    const saveSpy = sinon.spy(AccountDAODataBase.prototype, "save");
    const sendSpy = sinon.spy(MailerGateway.prototype, "send");

    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(saveSpy.calledOnce).toBe(true);
    expect(saveSpy.calledWith(input)).toBe(true);
    expect(sendSpy.calledOnce).toBe(true);
    expect(sendSpy.calledWith("Welcome", input.email, "Use this link to activate your account.")).toBe(true);
    saveSpy.restore();
    sendSpy.restore();
});

test.skip("Deve criar a conta do passageiro mock", async () => {
    const input = {
        name: "Ciclano de Almeida",
        email: `ciclano${Math.random()}@uber-fake.com`,
        cpf: "71428793860",
        isPassenger: true
    }

    const mailerGatewayMock = sinon.mock(MailerGateway.prototype);
    mailerGatewayMock.expects("send").withArgs("Welcome", input.email, "Use this link to activate your account.");
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    mailerGatewayMock.verify();
    mailerGatewayMock.restore();
});