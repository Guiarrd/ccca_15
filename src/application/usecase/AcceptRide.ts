import AccountRepository from "../../infrastructure/repository/AccountRepository";
import RideRepository from "../../infrastructure/repository/RideRepository";

export default class AcceptRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute (input: any) {
        const account = await this.accountRepository.getById(input.driverId);
        if (!account) throw new Error("Account does not exist.");
        if (account.isPassenger) throw new Error("Passenger cannot accept a ride.");
        const ride = await this.rideRepository.get(input.rideId);
        if (!ride) throw new Error("Ride not found.");
        ride.accept(input.driverId);
        this.rideRepository.update(ride);
    }
}

type Input = {
    rideId: string,
    driveId: string
}