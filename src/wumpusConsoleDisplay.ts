
import { WumpusRoom } from './wumpusRoom'
import { WumpusDisplay } from './wumpusDisplay'
import { WumpusOptions } from './wumpusOptions'

export type ConsoleWrite = (s: string) => void;

/**
 * WumpusDisplay implementation that outputs to the console.
 */
export class WumpusConsoleDisplay implements WumpusDisplay {

    private writeConsole: ConsoleWrite;

    public constructor(theConsole: ConsoleWrite) {
        this.writeConsole = theConsole;
    }

    public showIntroduction(options: WumpusOptions): void {
        this.writeConsole(`Hunt the Wumpus!

You're in a cave with ${options.numRooms} rooms and ${options.numDoors} tunnels leading from each room.\n
There are ${options.numBats} bats and ${options.numPits} pits scattered throughout the cave, and your\n
quiver holds ${options.numArrows} custom super anti-evil Wumpus arrows. Good luck.\n`);
    }

    public showRoomEntry(room: WumpusRoom): void {
        this.printRoom(room);
    }

    private printRoom(room: WumpusRoom) {
        this.writeConsole(`You are in room ${room.getRoomNumber()} of the cave`);
        
        let neighbors: WumpusRoom[] = room.getNeighbors();
        this.printNeighbors(neighbors);

    }

    private printNeighbors(neighbors: WumpusRoom[])
    {
        if(neighbors.length > 0) {
            let output: string = `There are tunnels leading to rooms ${neighbors[0].getRoomNumber()}`;
            for(let i = 1; i < neighbors.length; i++) {
                output += `, ${neighbors[i].getRoomNumber()}`
            }
            this.writeConsole(output);
        }
    }
}
