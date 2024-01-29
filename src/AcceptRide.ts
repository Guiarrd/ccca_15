import AccountDAO from "./AccountDAO";
import GetAccount from "./GetAccount";
import GetRide from "./GetRide";
import RideDAO from "./RideDAO";

export default class AcceptRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) {}

    async execute (input: any) {
        const account = await this.accountDAO.getById(input.driverId);
        if (account.is_passenger) throw new Error("Passenger cannot accept a ride.");
        const ride = await this.rideDAO.getByRideId(input.rideId);
        if (ride.status !== "requested") throw new Error("Can only accept a ride that is requested.");
        const driverRide = await this.rideDAO.getByDriverId(input.driverId);
        if (driverRide.status === "accepted" || driverRide.status === "in_progress") throw new Error("Driver already have a ride in progress.");
        ride.driver_id = input.driverId;
        ride.status = "accepted";
        this.rideDAO.update(ride);
    }
}