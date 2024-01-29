import RideDAO from "./RideDAO";

export default class GetRide {
    constructor(readonly rideDao: RideDAO) {}

    async execute (rideId: string) {
        return await this.rideDao.getByRideId(rideId)
    }
}