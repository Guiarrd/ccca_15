import pgp from "pg-promise";

export default interface RideDAO {
    getByPassengerId (passengerId: string): Promise<any>;
    save (ride: any): Promise<void>
}

export class RideDAODataBase implements RideDAO {
    async getByPassengerId(passengerId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:postgres@localhost:5432/postgres");
        const [ride] = await connection.query("select * from cccat15.ride where passenger_id = $1", [passengerId]);
        await connection.$pool.end();
        return ride;
    }

    async save(ride: any): Promise<void> {
        ride.status = "requested";
        ride.date = new Date()
        const connection = pgp()("postgres://postgres:postgres@localhost:5432/postgres");
        await connection.query("insert into cccat15.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.status, ride.from[0], ride.from[1], ride.to[0], ride.to[1], ride.date[0]]);	
        await connection.$pool.end();
    }
}