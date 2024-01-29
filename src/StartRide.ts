import RideDAO from "./RideDAO";

export default class StartRide {
    constructor(readonly rideDAO: RideDAO) {}

    async execute(rideId: string) {
        const ride = await this.rideDAO.getByRideId(rideId);
        if (ride.status !== "accepted") throw new Error("Ride must be accepted.");
        ride.status = "in_progress";
        this.rideDAO.update(ride);
    }
}