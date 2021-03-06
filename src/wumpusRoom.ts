
export interface WumpusRoom {
    /**
     * Get the number associated with this room.
     */
    getRoomNumber(): number;

    /**
     * Get an array of rooms connected to this room.
     */
    getNeighbors(): WumpusRoom[];

    /**
     * Get the number of neighbors connected to this room.
     */
    numNeighbors(): number;

    /**
     * Add the WumpusRoom as a neighbor of this one.
     */
    addNeighbor(neighbor: WumpusRoom): void;

    /**
     * Returns true if the room is a neighbor of this room.
     */
    hasNeighbor(room: WumpusRoom): boolean;

    /**
     * Set whether the room has a pit.
     */
    setPit(hasPit: boolean): void;

    /**
     * Returns true if the room contains a pit.
     */
    hasPit(): boolean;

    /**
     * Returns true if a pit is in a neighboring room.
     */
    pitNearby(): boolean;

    /**
     * Set whether the room has bats.
     * @param hasBat 
     */
    setBats(hasBat: boolean): void;

    /**
     * Returns a boolean indicating if bats are in the room.
     */
    hasBats(): boolean;

    /**
     * Returns true if bats are in a neighboring room.
     */
    batsNearby(): boolean;

    /**
     * Put a Wumpus in the room.
     */
    setWumpus(hasWumpus: boolean): void;

    /**
     * Returns true if a Wumpus is in the room.
     */
    hasWumpus(): boolean;

    /**
     * Returns true if a Wumpus is in a neighboring room.
     */
    wumpusNearby(): boolean;
}

export class WumpusRoomImpl implements WumpusRoom {
    private roomNumber: number;
    private neighbors: WumpusRoom[];
    private hasPit_: boolean;
    private hasBats_: boolean;
    private hasWumpus_: boolean;

    constructor(roomNumber: number) {
        this.roomNumber = roomNumber;
        this.neighbors = [];
        this.hasPit_ = false;
        this.hasBats_ = false;
        this.hasWumpus_ = false;
    }

    getRoomNumber(): number { return this.roomNumber; }

    getNeighbors(): WumpusRoom[] { return this.neighbors; }

    numNeighbors(): number { return this.neighbors.length; }

    addNeighbor(neighbor: WumpusRoom): void {
        let inserted: boolean = false;
        let i: number = 0;

        while(!inserted && i < this.numNeighbors()) {
            const neighborRoomNum = neighbor.getRoomNumber();
            const otherRoomNum = this.neighbors[i].getRoomNumber();
            if(neighborRoomNum <= otherRoomNum) {
                this.neighbors.splice(i, 0, neighbor);
                inserted = true;
            }
            i++;
        }

        if(!inserted) {
            this.neighbors.push(neighbor);
        }
    }

    hasNeighbor(room: WumpusRoom): boolean {
        for(let i = 0; i < this.numNeighbors(); i++) {
            if(this.neighbors[i].getRoomNumber() === room.getRoomNumber()) {
                return true;
            }
        }
        return false;
    }

    setPit(hasPit: boolean): void { this.hasPit_ = hasPit; }

    hasPit(): boolean { return this.hasPit_; }

    pitNearby(): boolean {
        for(let i = 0; i < this.neighbors.length; i++) {
            if(this.neighbors[i].hasPit()) {
                return true;
            }
        }
        return false;
    }

    setBats(hasBat: boolean): void
    {
        this.hasBats_ = hasBat;
    }

    hasBats(): boolean
    {
        return this.hasBats_;
    }

    batsNearby(): boolean
    {
        for(let i = 0; i < this.neighbors.length; i++) {
            if(this.neighbors[i].hasBats()) {
                return true;
            }
        }
        return false;
    }

    setWumpus(hasWumpus: boolean): void
    {
        this.hasWumpus_ = hasWumpus;
    }

    hasWumpus(): boolean
    {
        return this.hasWumpus_;
    }

    wumpusNearby(): boolean
    {
        for(let i = 0; i < this.neighbors.length; i++) {
            if(this.neighbors[i].hasWumpus()) {
                return true;
            }
        }
        return false;
    }
}
