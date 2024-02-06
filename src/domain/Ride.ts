import crypto from "crypto";
import Coord from "./Coord";

export default class Ride {
    private from: Coord;
    private to: Coord;
    private lastPosition: Coord;

    private constructor (readonly rideId: string, readonly passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, private status: string, readonly date: Date, lastLat: number, lastLong: number, private distance: number, private driverId?: string) {
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
        this.lastPosition = new Coord(lastLat, lastLong);
    }
    
    static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const status = "requested";
        const date = new Date();
        return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date, fromLat, fromLong, 0);
    }
    
    static restore (rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, lastLat: number, lastLong: number, distance: number, driverId?: string) {
        return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date, lastLat, lastLong, distance, driverId);
    }
    
    accept(driverId: string) {
        if (this.status !== "requested") throw new Error("Invalid status");
        this.status = "accepted";
        this.driverId = driverId;
    }
    
    start() {
        if (this.status !== "accepted") throw new Error("Invalid status");
        this.status = "in_progress";
    }

    updatePosition(lat: number, long: number) {
        if (this.status !== "in_progress") throw new Error("Could not update position.");
        const newLastPosition = new Coord(lat, long);
        this.distance += this.calculateDistance(this.lastPosition, newLastPosition);
        this.lastPosition = newLastPosition;
    }

    private calculateDistance (from: Coord, to: Coord) {
		const earthRadius = 6371;
		const degreesToRadians = Math.PI / 180;
		const deltaLat = (to.getLat() - from.getLat()) * degreesToRadians;
		const deltaLon = (to.getLong() - from.getLong()) * degreesToRadians;
		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(from.getLat() * degreesToRadians) *
			Math.cos(to.getLat() * degreesToRadians) *
			Math.sin(deltaLon / 2) *
			Math.sin(deltaLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return Math.round(earthRadius * c);
	}

    getStatus () {
        return this.status;
    }

    getDriverId () {
        return this.driverId;
    }

    getFromLat() {
        return this.from.getLat();
    }

    getFromLong() {
        return this.from.getLong();
    }

    getToLat() {
        return this.to.getLat();
    }

    getToLong() {
        return this.to.getLong();
    }

    getDistance () {
        return this.distance;
    }

    getLastLat () {
        return this.lastPosition.getLat();
    }

    getLastLong () {
        return this.lastPosition.getLong();
    }
}