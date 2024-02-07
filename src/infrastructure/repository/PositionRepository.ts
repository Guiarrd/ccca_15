import Position from "../../domain/Position";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface PositionRepository {
    save (position: Position): Promise<void>;
    getPositionsByRideId (rideId: string): Promise<Position []>;
}

export class PositionRepositoryDataBase implements PositionRepository {
    constructor (readonly connection: DatabaseConnection) {}
    
    async save(position: Position): Promise<void> {
        this.connection.query("insert into cccat15.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.getLat(), position.getLong(), position.date]);
    }

    async getPositionsByRideId(rideId: string): Promise<Position[]> {
        const dataPositions = await this.connection.query("select * from cccat15.position where ride_id = $1", [rideId]);
        const positions = [];
        for (const dataPosition of dataPositions) {
            positions.push(new Position(dataPosition.position_id, dataPosition.ride_id, parseFloat(dataPosition.lat), parseFloat(dataPosition.long), dataPosition.date));
        }
        return positions;
    }
}