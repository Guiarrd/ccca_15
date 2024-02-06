import crypto from "crypto";
import sinon from "sinon";
import StartRide from "../src/application/usecase/StartRide";
import { RideRepositoryDataBase } from "../src/infrastructure/repository/RideRepository";
import { PgPromiseAdapter } from "../src/infrastructure/database/DatabaseConnection";

let startRide: StartRide;

const input = {
    rideId: crypto.randomUUID()
}

beforeEach(() => {
    const connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDataBase(connection);
    startRide = new StartRide(rideRepository);
})

// test("Não deve iniciar uma corrida que não esteja com status aceita", async () => {
//     const rideStub = {
//         ride_id: input.rideId,
//         passenger_id: crypto.randomUUID(),
//         driver_id: crypto.randomUUID(),
//         status: "in_progress"
//     }
//     const getByRideIdStub = sinon.stub(RideRepositoryDataBase.prototype, "getByRideId").resolves(rideStub)

//     await expect(() => startRide.execute(input.rideId)).rejects.toThrow(new Error("Ride must be accepted."));
//     getByRideIdStub.restore();
// })

// test("Deve iniciar uma corrida", async () => {
//     const rideStub = {
//         ride_id: input.rideId,
//         passenger_id: crypto.randomUUID(),
//         driver_id: crypto.randomUUID(),
//         status: "accepted"
//     }
//     const getByRideIdStub = sinon.stub(RideRepositoryDataBase.prototype, "getByRideId").resolves(rideStub)
//     const updateSpy = sinon.spy(RideRepositoryDataBase.prototype, "update");

//     await startRide.execute(input.rideId);

//     expect(updateSpy.calledOnce).toBe(true);
//     expect(updateSpy.calledWith({
//         ...rideStub,
//         status: "in_progress"
//     })).toBe(true);
//     updateSpy.restore();
//     getByRideIdStub.restore();
// })