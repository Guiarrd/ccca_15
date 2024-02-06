import crypto from "crypto";
import { AccountRepositoryDataBase } from "../src/infrastructure/repository/AccountRepository";
import AcceptRide from "../src/application/usecase/AcceptRide";
import { RideRepositoryDataBase } from "../src/infrastructure/repository/RideRepository";
import { PgPromiseAdapter } from "../src/infrastructure/database/DatabaseConnection";

let acceptRide: AcceptRide;

const input = {
    rideId: crypto.randomUUID(),
    driverId: crypto.randomUUID()
}
const driverStub = {
    account_id: input.driverId,
    name: "Fulano da Silva",
    email: `fulano${Math.random()}@uber-fake.com`,
    cpf: "97456321558",
    car_plate: "ABC1234",
    is_driver: true
}
const rideStub = {
    ride_id: input.rideId,
    passenger_id: crypto.randomUUID(),
    status: "in_progress"
}

beforeEach(() => {
    const connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDataBase(connection);
    const rideRepository = new RideRepositoryDataBase(connection);
    acceptRide = new AcceptRide(accountRepository, rideRepository);
})

// test("Não deve permitir que um passageiro aceite uma corrida", async () => {
//     const passengerStub = {
//         account_id: input.driverId,
//         name: "Ciclano de Almeida",
//         email: `ciclano${Math.random()}@uber-fake.com`,
//         cpf: "71428793860",
//         is_passenger: true
//     }
//     const getByIdStub = sinon.stub(AccountRepositoryDataBase.prototype, "getById").resolves(passengerStub)

//     await expect(() => acceptRide.execute(input)).rejects.toThrow(new Error("Passenger cannot accept a ride."));
//     getByIdStub.restore();
// })

// test("Não deve aceitar corrida que não esteja com status solicitada", async () => {
//     const getByIdStub = sinon.stub(AccountRepositoryDataBase.prototype, "getById").resolves(driverStub)
//     const getByRideIdStub = sinon.stub(RideDAODataBase.prototype, "getByRideId").resolves(rideStub)

//     await expect(() => acceptRide.execute(input)).rejects.toThrow(new Error("Can only accept a ride that is requested."));
//     getByIdStub.restore();
//     getByRideIdStub.restore();
// })

// test("Não deve permitir que um motorista aceite a corrida se ele possuir outras corridas em andamento", async () => {
//     const requestedRideStub = {
//         ...rideStub,
//         status: "requested"
//     }
//     const getByIdStub = sinon.stub(AccountRepositoryDataBase.prototype, "getById").resolves(driverStub)
//     const getByRideIdStub = sinon.stub(RideDAODataBase.prototype, "getByRideId").resolves(requestedRideStub)
//     const getByDriverIdStub = sinon.stub(RideDAODataBase.prototype, "getByDriverId").resolves(rideStub)

//     await expect(() => acceptRide.execute(input)).rejects.toThrow(new Error("Driver already have a ride in progress."));
//     getByIdStub.restore();
//     getByRideIdStub.restore();
//     getByDriverIdStub.restore();
// })

// test("Deve permitir que um motorista aceite uma corrida", async () => {
//     const requestedRideStub = {
//         ...rideStub,
//         status: "requested"
//     }
//     const completedRideStub = {
//         ...rideStub,
//         status: "completed"
//     }
//     const acceptedRideStub = {
//         ...rideStub,
//         driver_id: input.driverId,
//         status: "accepted"
//     }
//     const getByIdStub = sinon.stub(AccountRepositoryDataBase.prototype, "getById").resolves(driverStub)
//     const getByRideIdStub = sinon.stub(RideDAODataBase.prototype, "getByRideId").resolves(requestedRideStub)
//     const getByDriverIdStub = sinon.stub(RideDAODataBase.prototype, "getByDriverId").resolves(completedRideStub)
//     const updateSpy = sinon.spy(RideDAODataBase.prototype, "update");

//     await acceptRide.execute(input);

//     expect(updateSpy.calledOnce).toBe(true);
//     expect(updateSpy.calledWith(acceptedRideStub)).toBe(true);
//     updateSpy.restore();
//     getByIdStub.restore();
//     getByRideIdStub.restore();
//     getByDriverIdStub.restore();
// })