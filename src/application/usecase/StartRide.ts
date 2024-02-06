import RideRepository from "../../infrastructure/repository/RideRepository";

export default class StartRide {
    constructor(readonly rideRepository: RideRepository) {}

    async execute(rideId: string) {
    }
}