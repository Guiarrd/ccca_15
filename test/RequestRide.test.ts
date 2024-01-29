import { AccountDAODataBase } from '../src/AccountDAO';
import GetAccount from '../src/GetAccount';
import RequestRide from '../src/RequestRide';
import crypto from "crypto";
import sinon from "sinon";
import { RideDAODataBase } from '../src/RideDAO';

let requestRide: RequestRide;

const input = {
    passengerId: crypto.randomUUID(), 
    from: [12345, 67890], 
    to: [98760, 54321]
}
const passengerStub = {
    accountId: input.passengerId,
    name: "Ciclano de Almeida",
    email: `ciclano${Math.random()}@uber-fake.com`,
    cpf: "71428793860",
    is_passenger: true
}
const rideStub = {
    rideId: crypto.randomUUID(),
    passengerId: input.passengerId,
    status: "em andamento"
}

beforeEach(() => {
    const accountDAO = new AccountDAODataBase();
    requestRide = new RequestRide(accountDAO);
})

test("Não deve solicitar uma corrida se a conta for de um motorista", async () => {
    const driverStub = {
        accountId: input.passengerId,
        name: "Fulano da Silva",
        email: `fulano${Math.random()}@uber-fake.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        is_driver: true
    }
    const getByIdStub = sinon.stub(AccountDAODataBase.prototype, "getById").resolves(driverStub)

    await expect(() => requestRide.execute(input)).rejects.toThrow(new Error("Cannot request a ride for drivers."));
    getByIdStub.restore();
})

test("Não deve solicitar uma corrida se o passageiro já possuir uma corrida em andamento", async () => {
    const getByIdStub = sinon.stub(AccountDAODataBase.prototype, "getById").resolves(passengerStub)
    const getByPassengerIdStub = sinon.stub(RideDAODataBase.prototype, "getByPassengerId").resolves(rideStub)

    await expect(() => requestRide.execute(input)).rejects.toThrow(new Error("Cannot request a ride for passengers with unfinished rides."));
    getByIdStub.restore();
    getByPassengerIdStub.restore();
})

test("Deve solicitar a corrida do passageiro", async () => {
    const completedRideStub = {
        ...rideStub,
        status: "completed"
    }
    const getByIdStub = sinon.stub(AccountDAODataBase.prototype, "getById").resolves(passengerStub)
    const getByPassengerIdStub = sinon.stub(RideDAODataBase.prototype, "getByPassengerId").resolves(completedRideStub)

    const outputRide = await requestRide.execute(input);
    
    expect(outputRide.rideId).toBeDefined();
    getByIdStub.restore();
    getByPassengerIdStub.restore();
});