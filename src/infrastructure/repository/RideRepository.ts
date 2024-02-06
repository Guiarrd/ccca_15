import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
    getActiveRidesByPassengerId (passengerId: string): Promise<Ride[]>;
    get (rideId: string): Promise<Ride | undefined>;
    save (ride: Ride): Promise<void>;
    update(ride: any): Promise<void>;
}

export class RideRepositoryDataBase implements RideRepository {

    constructor (readonly connection: DatabaseConnection) {}

    async save(ride: Ride): Promise<void> {
        await this.connection.query("insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, "requested", new Date()]);	
    }
    
    async get(rideId: string): Promise<any> {
        const [ride] = await this.connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
        if (!ride) return;
        return Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date, ride.driver_id);
    }

    async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
        const activeRidesData = await this.connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
        const activeRides: Ride[] = [];
        for (const activeRideData of activeRidesData) {
            activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, parseFloat(activeRideData.from_lat), parseFloat(activeRideData.from_long), parseFloat(activeRideData.to_lat), parseFloat(activeRideData.to_long), activeRideData.getStatus(), activeRideData.date, activeRideData.driver_id));
        }
        return activeRides;
    }

    async update(ride: Ride): Promise<void> {
        await this.connection.query("update cccat15.ride set driver_id = $1, status = $2 where ride_id = $3", [ride.getDriverId(), ride.getStatus(), ride.rideId]);	
    }
}