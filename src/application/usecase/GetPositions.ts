import PositionRepository from "../../infrastructure/repository/PositionRepository";

export default class GetPositions {
    constructor(readonly positionRepository: PositionRepository) {}

    async execute (rideId: string): Promise<Output[]> {
        const ridePositions = await this.positionRepository.getPositionsByRideId(rideId);
        const output = [];
        for (const position of ridePositions) {
            output.push({
                positionId: position.positionId,
                rideId: position.rideId,
                lat: position.getLat(),
                long: position.getLong(),
                date: position.date
            });
        }
        return output;
    }
}

type Output = {
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    date: Date
}