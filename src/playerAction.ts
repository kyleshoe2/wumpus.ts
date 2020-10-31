import { WumpusCave, WumpusCaveImpl } from './wumpusCave'
import { WumpusRoom } from './wumpusRoom'
import { WumpusDisplay } from './wumpusDisplay'
import { WumpusCommandType, WumpusCommand } from './wumpusCommand'
import { RandomRangeFunction, getRandomIntBetween } from './wumpusUtils'
import { assert } from 'console';

abstract class GameEvent {

    /**
     * Performs the event and returns the next one.
     */
    public abstract perform(cave: WumpusCave): GameEvent;
}

class GameOverEvent extends GameEvent {
    constructor() {
        super();
    }

    public perform(cave: WumpusCave): GameEvent {
        return this;
    }
}

class PlayerHitWallEvent extends GameEvent {
    constructor() {
        super();
    }

    public perform(cave: WumpusCave): GameEvent {
        return null;
    }
}

class PlayerFellInPitEvent extends GameEvent {
    constructor() {
        super();
    }

    public perform(cave: WumpusCave): GameEvent {
        return null;
    }
}

class MovedByBatsEvent extends GameEvent {
    constructor() {
        super();
    }

    public perform(cave: WumpusCave): GameEvent {
        return null;
    }
}

class PlayerEnteredRoomEvent extends GameEvent {
    constructor() {
        super();
    }

    public perform(cave: WumpusCave): GameEvent {
        return null;
    }
}


/**
 * Abstraction for an action a player can perform.
 */
export interface PlayerAction {

    /**
     * Perform the action.
     * 
     * Returns true if the game is still running.
     */
    perform(cave: WumpusCave, display: WumpusDisplay): boolean;
}

/**
 * Handles quitting the game.
 */
export class QuitGame implements PlayerAction {
    perform(cave: WumpusCave, display: WumpusDisplay): boolean {
        // FUTURE Prompt the user if they want to quit.
        cave;
        display;
        return false;
    }
}

class MovePlayerEx {

    private roomNumber: number;
    private randInt: RandomRangeFunction;

    constructor(roomNumber: number) {
        this.roomNumber = roomNumber;
        this.randInt = getRandomIntBetween;
    }

    public setRandIntFunction(randInt: RandomRangeFunction) {
        this.randInt = randInt;
    }

    public movePlayer(cave: WumpusCave): GameEvent {
        let result: GameEvent;

        if(cave.adjacentRoom(this.roomNumber)) {
            cave.move(this.roomNumber);
            result = this.handleMove(cave);
        } else {
            result = this.handleHittingWall(cave);
        }

        return result;
    }

    private handleHittingWall(cave: WumpusCave): GameEvent {
        cave; // Unused for now
        return new PlayerHitWallEvent();
    }

    private handleMove(cave: WumpusCave): GameEvent {
        return this.handleHazards(cave);
    }

    private handleHazards(cave: WumpusCave): GameEvent {
        let result: GameEvent;
        const currentRoom = cave.getCurrentRoom();
        if(currentRoom.hasPit()) {
            result = this.handlePit(cave);
        } else if(currentRoom.hasBats()) {   
            result = this.handleBats(cave);
        } else {
            result = new PlayerEnteredRoomEvent();
        }
        return result;
    }

    private handlePit(cave: WumpusCave): GameEvent {
        cave; // Unused for now
        return new PlayerFellInPitEvent();
    }

    private handleBats(cave: WumpusCave): GameEvent {
        cave.movePlayerToRandomRoom();
        return new MovedByBatsEvent();
    }
}

/**
 * Handles moving the player.
 */
export class MovePlayer implements PlayerAction {

    private movePlayerEx: MovePlayerEx;

    constructor(roomNumber: number) {
        this.movePlayerEx = new MovePlayerEx(roomNumber);
    }

    public setRandIntFunction(randInt: RandomRangeFunction) {
        this.movePlayerEx.setRandIntFunction(randInt);
    }

    perform(cave: WumpusCave, display: WumpusDisplay): boolean {
        const gameEvent = this.movePlayerEx.movePlayer(cave);
        this.displayGameEvent(gameEvent, display);
        return this.isGameOver(gameEvent);
    }

    displayGameEvent(gameEvent: GameEvent, display: WumpusDisplay): void {
        if(gameEvent instanceof PlayerHitWallEvent) {
            display.showPlayerHitWall();
        } else if(gameEvent instanceof PlayerFellInPitEvent) {
            display.showPlayerFellInPit();
        } else if(gameEvent instanceof MovedByBatsEvent) {
            display.showPlayerMovedByBats();
        }
    }

    isGameOver(gameEvent: GameEvent): boolean {
        if(gameEvent instanceof PlayerFellInPitEvent) {
            return false;
        } else {
            return true;
        }
    }
}

/**
 * Factory class that makes PlayerAction objects.
 */
export interface PlayerActionFactory {
    /**
     * Create the player action from the player command.
     * @param command 
     */
    createPlayerAction(action: WumpusCommand): PlayerAction;
}

export class PlayerActionFactoryImpl implements PlayerActionFactory {

    createPlayerAction(command: WumpusCommand): PlayerAction {
        if(command.type === WumpusCommandType.Move) {
            const roomNumber = command.args[0];
            return new MovePlayer(roomNumber);
        }
        else if(command.type === WumpusCommandType.Quit) {
            return new QuitGame();
        }
        else
        {
            return undefined;
        }
    }
}

