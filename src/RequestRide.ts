import crypto from "crypto";
import GetAccount from "./GetAccount";
import { RideDAODataBase } from "./RideDAO";

export default class RequestRide {
    constructor(readonly getAccount: GetAccount) {}

    async execute (input: any) {
        input.rideId = crypto.randomUUID();
        const requesterAccount = await this.getAccount.execute(input.passengerId);
        if (requesterAccount.is_driver) throw new Error("Cannot request a ride for drivers.")
        const rideDAO = new RideDAODataBase();
        const outputRide = await rideDAO.getByPassengerId(input.passengerId);
        if (outputRide.status !== "completed") throw new Error("Cannot request a ride for passengers with unfinished rides.")
        rideDAO.save(input);
        return {
            rideId: input.rideId
        }
    }
}