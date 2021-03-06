import { WumpusDisplay } from './wumpusDisplay';
import {
    GameEvent,
    PlayerHitWallEvent,
    MovedByBatsEvent,
    PlayerFellInPitEvent,
    PlayerSurvivedPitEvent,
    PlayerIdleEvent,
    PlayerEatenByWumpus,
    PlayerShotWumpusEvent,
    ArrowEnteredRandomRoomEvent,
    PlayerShotSelfEvent,
    ArrowWentNowhereEvent,
    PlayerOutOfArrowsEvent
} from './gameEvent';
import { GameState } from './gameState'

/**
 * Provides a display for each game event.
 */
export interface GameEventDisplay {

    /**
     * Display details about the current game state.
     */
    displayGameState(gameState: GameState): void;

    /**
     * Display the game event to the user.
     * @param gameEvent 
     */
    displayGameEvent(gameEvent: GameEvent): void;
}

/**
 * Implementation of GameEventDisplay.
 */
export class GameEventDisplayImpl implements GameEventDisplay {
    private display: WumpusDisplay;
    private movedByBats: boolean;

    constructor(display: WumpusDisplay) {
        this.display = display;
        this.movedByBats = false;
    }

    public displayGameState(gameState: GameState): void {
        this.display.showGameState(gameState);
    }

    public displayGameEvent(gameEvent: GameEvent): void {
        if (gameEvent instanceof PlayerHitWallEvent) {
            this.display.showPlayerHitWall();
        } else if(gameEvent instanceof PlayerSurvivedPitEvent) {
            this.display.showPlayerSurvivedPit();
        } else if (gameEvent instanceof PlayerFellInPitEvent) {
            this.display.showPlayerFellInPit();
        } else if (gameEvent instanceof MovedByBatsEvent) {
            if(this.movedByBats) {
                this.display.showPlayerMovedByBatsAgain();
            } else {
                this.movedByBats = true;
                this.display.showPlayerMovedByBats();
            }
        } else if (gameEvent instanceof PlayerEatenByWumpus) {
            this.display.showPlayerEatenByWumpus();
        } else if (gameEvent instanceof PlayerIdleEvent) {
            this.movedByBats = false;
        } else if(gameEvent instanceof ArrowWentNowhereEvent) {
            this.display.showArrowWentNowhere();
        } else if(gameEvent instanceof ArrowEnteredRandomRoomEvent) {
            const arrowEnteredRandRoom = gameEvent as ArrowEnteredRandomRoomEvent;
            this.display.showArrowEnteredRandomRoom(
                arrowEnteredRandRoom.getFromRoom(),
                arrowEnteredRandRoom.getToRoom(),
                arrowEnteredRandRoom.getEnteredRoom());
        } else if(gameEvent instanceof PlayerOutOfArrowsEvent) {
            this.display.showPlayerOutOfArrows();
        } else if (gameEvent instanceof PlayerShotWumpusEvent) {
            this.display.showPlayerShotWumpus();
        } else if(gameEvent instanceof PlayerShotSelfEvent) {
            this.display.showPlayerShotSelf();
        }
    }
}
