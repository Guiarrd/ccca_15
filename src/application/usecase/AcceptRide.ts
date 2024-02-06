import AccountRepository from "../../infrastructure/repository/AccountRepository";
import GetAccount from "./GetAccount";
import GetRide from "./GetRide";
import RideRepository from "../../infrastructure/repository/RideRepository";

export default class AcceptRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute (input: any) {
        const account = await this.accountRepository.getById(input.driverId);
        if (account?.isPassenger) throw new Error("Passenger cannot accept a ride.");
        const ride = await this.rideRepository.get(input.rideId);
        if (!ride) throw new Error("Ride not found.");
        if (ride.status !== "requested") throw new Error("Can only accept a ride that is requested.");
    }
}