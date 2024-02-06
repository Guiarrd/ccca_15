import { RideRepositoryDataBase } from "../../infrastructure/repository/RideRepository";
import AccountRepository from "../../infrastructure/repository/AccountRepository";
import Ride from "../../domain/Ride";

export default class RequestRide {
    constructor(readonly rideRepository: RideRepositoryDataBase, readonly accountRepository: AccountRepository) {}

    async execute (input: Input): Promise<Output> {
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        const account = await this.accountRepository.getById(ride.passengerId);
        if (!account) throw new Error("Account does not exist.")
        if (account.isDriver) throw new Error("Cannot request a ride for drivers.")
        const [activeRide] = await this.rideRepository.getActiveRidesByPassengerId(input.passengerId);
        if (activeRide) throw new Error("Cannot request a ride for passengers with unfinished rides.")
        await this.rideRepository.save(ride);
        return {
            rideId: ride.rideId
        }
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string
}