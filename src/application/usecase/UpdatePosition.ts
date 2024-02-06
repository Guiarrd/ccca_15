import RideRepository from "../../infrastructure/repository/RideRepository";

export default class UpdatePosition {
    constructor(readonly rideRepository: RideRepository) {}

    async execute(input: Input) {
        const ride = await this.rideRepository.get(input.rideId);
        if (!ride) throw new Error("Ride not found.");
        ride.updatePosition(input.lat, input.long);
        await this.rideRepository.update(ride);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number
}