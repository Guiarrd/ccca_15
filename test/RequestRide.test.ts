import { AccountRepositoryDataBase } from '../src/infrastructure/repository/AccountRepository';
import RequestRide from '../src/application/usecase/RequestRide';
import crypto from "crypto";
import { RideRepositoryDataBase } from '../src/infrastructure/repository/RideRepository';
import { PgPromiseAdapter } from '../src/infrastructure/database/DatabaseConnection';

let requestRide: RequestRide;

const input = {
    passengerId: crypto.randomUUID(), 
    from_lat: 12345, 
    from_long: 67890, 
    to_lat: 98760,
    to_long: 54321
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
    const connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDataBase(connection);
    const rideDAO = new RideRepositoryDataBase(connection);
    requestRide = new RequestRide(rideDAO, accountRepository);
})

// test("Não deve solicitar uma corrida se a conta for de um motorista", async () => {
//     const driverStub = {
//         accountId: input.passengerId,
//         name: "Fulano da Silva",
//         email: `fulano${Math.random()}@uber-fake.com`,
//         cpf: "97456321558",
//         carPlate: "ABC1234",
//         is_driver: true
//     }
//     const getByIdStub = sinon.stub(AccountRepositoryDataBase.prototype, "getById").resolves(driverStub)

//     await expect(() => requestRide.execute(input)).rejects.toThrow(new Error("Cannot request a ride for drivers."));
//     getByIdStub.restore();
// })

// test("Não deve solicitar uma corrida se o passageiro já possuir uma corrida em andamento", async () => {
//     const getByIdStub = sinon.stub(AccountRepositoryDataBase.prototype, "getById").resolves(passengerStub)
//     const getByPassengerIdStub = sinon.stub(RideDAODataBase.prototype, "getActiveRidesByPassengerId").resolves(rideStub)

//     await expect(() => requestRide.execute(input)).rejects.toThrow(new Error("Cannot request a ride for passengers with unfinished rides."));
//     getByIdStub.restore();
//     getByPassengerIdStub.restore();
// })

// test("Deve solicitar a corrida do passageiro", async () => {
//     const completedRideStub = {
//         ...rideStub,
//         status: "completed"
//     }
//     const getByIdStub = sinon.stub(AccountRepositoryDataBase.prototype, "getById").resolves(passengerStub)
//     const getByPassengerIdStub = sinon.stub(RideDAODataBase.prototype, "getActiveRidesByPassengerId").resolves(null)

//     const outputRide = await requestRide.execute(input);
    
//     expect(outputRide.rideId).toBeDefined();
//     getByIdStub.restore();
//     getByPassengerIdStub.restore();
// });