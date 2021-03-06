import { WumpusRoom } from './wumpusRoom'
import { getRandomIntBetween } from './wumpusRandom'

/**
 * Allows traversing the Wumpus cave.
 */
export interface WumpusCave {
    /**
     * Returns the room the player is currently in.
     */
    getCurrentRoom(): WumpusRoom;

    /**
     * Move to the specified room.
     */
    move(roomNumber: number): void;

    /**
     * Moves the player to a random room.
     */
    movePlayerToRandomRoom(): void;

    /**
     * Determines if a room with the room number is adjacent to the one we're in.
     */
    adjacentRoom(roomNumber: number): boolean;

    /**
     * Get the room from the room number.
     */
    getRoom(roomNumber: number): WumpusRoom;
}

export class WumpusCaveImpl implements WumpusCave {
    private readonly rooms: WumpusRoom[];
    private currentRoom: WumpusRoom;

    constructor(rooms: WumpusRoom[]) {
        this.rooms = rooms;
        this.currentRoom = this.rooms[0];
    }

    getCurrentRoom(): WumpusRoom { return this.currentRoom; }

    move(roomNumber: number): void {
        for(let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            if(room.getRoomNumber() === roomNumber) {
                this.currentRoom = room;
                break;
            }
        }
    }

    movePlayerToRandomRoom(): void
    {
        const newRoomNumber = getRandomIntBetween(1, this.rooms.length+1);
        this.move(newRoomNumber);
    }

    adjacentRoom(roomNumber: number): boolean {
        const neighbors = this.currentRoom.getNeighbors();
        for(let i = 0; i < neighbors.length; i++) {
            if(neighbors[i].getRoomNumber() === roomNumber)
            {
                return true;
            }
        }
        return false;
    }

    getRoom(roomNumber: number): WumpusRoom {
        for(let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            if(room.getRoomNumber() === roomNumber) {
                return room;
            }
        }
    }

}

