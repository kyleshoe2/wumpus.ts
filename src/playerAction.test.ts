import { expect } from 'chai';
import * as tsSinon from 'ts-sinon'
import { WumpusCave } from './wumpusCave'
import { WumpusDisplay } from './wumpusDisplay'
import { WumpusCommandType, WumpusCommand } from './wumpusCommand';
import { MovePlayer, PlayerActionFactoryImpl, QuitGame, GameEventDisplay } from './playerAction';
import { GameEvent, GameOverEvent, MovedByBatsEvent, PlayerFellInPitEvent, PlayerHitWallEvent, PlayerIdleEvent } from './gameEvent'

describe("GameEventDisplay", () => {
    let display: tsSinon.StubbedInstance<WumpusDisplay> = null;
    let gameEventDisplay: GameEventDisplay = null;

    beforeEach(() => {
        display = tsSinon.stubInterface<WumpusDisplay>();
        gameEventDisplay = new GameEventDisplay();
    });

    it("tells player they fell in a pit when they enter a room with a pit", () => {
        gameEventDisplay.displayGameEvent(new PlayerFellInPitEvent(), display);

        expect(display.showPlayerFellInPit.calledOnce).equals(true);
    });

    it("tells player they hit a wall when moving to a non-adjacent room", () => {
        gameEventDisplay.displayGameEvent(new PlayerHitWallEvent(), display);

        expect(display.showPlayerHitWall.calledOnce).equals(true);
    });

    it("tells player they were moved by bats when they enter a room with bats", () => {
        gameEventDisplay.displayGameEvent(new MovedByBatsEvent(), display);

        expect(display.showPlayerMovedByBats.calledOnce).equals(true);
    });
});

describe("MovePlayer", () => {
    let cave: tsSinon.StubbedInstance<WumpusCave> = null;
    let display: tsSinon.StubbedInstance<WumpusDisplay> = null;
    let playerMovedToRoomEvent: tsSinon.StubbedInstance<GameEvent> = null;
    let movePlayer: MovePlayer = null;

    beforeEach(() => {
        cave = tsSinon.stubInterface<WumpusCave>();
        display = tsSinon.stubInterface<WumpusDisplay>();
        playerMovedToRoomEvent = getGameEventStub();
        movePlayer = new MovePlayer(playerMovedToRoomEvent);
    });

    function getGameEventStub(): tsSinon.StubbedInstance<GameEvent> {
        return tsSinon.stubInterface<GameEvent>();
    }

    it("indicates game is running when the next event is that the player is idle", () => {
        playerMovedToRoomEvent.perform.returns(new PlayerIdleEvent());

        const gameRunning = movePlayer.perform(cave, display);

        expect(gameRunning).equals(true);
    });

    it("indicates game is not running when the next event is that the game is over", () => {
        playerMovedToRoomEvent.perform.returns(new GameOverEvent());

        const gameRunning = movePlayer.perform(cave, display);

        expect(gameRunning).equals(false);
    });

    it("keeps performing events that it receives until it's done", () => {
        const gameEvent1 = getGameEventStub();
        const gameEvent2 = getGameEventStub();
        const gameEvent3 = new PlayerIdleEvent();

        playerMovedToRoomEvent.perform.returns(gameEvent1);
        gameEvent1.perform.returns(gameEvent2);
        gameEvent2.perform.returns(gameEvent3);

        movePlayer.perform(cave, display);

        expect(playerMovedToRoomEvent.perform.calledOnce).equals(true);
        expect(gameEvent1.perform.calledOnce).equals(true);
        expect(gameEvent2.perform.calledOnce).equals(true);
    });
});

describe("PlayerActionFactoryImp", () => {
    let factory: PlayerActionFactoryImpl = new PlayerActionFactoryImpl();

    it("returns a move player action when given a move command and room number", () => {
        const command = new WumpusCommand(WumpusCommandType.Move, [ 1 ]);
        const action = factory.createPlayerAction(command);
        expect(action.constructor.name).equals(MovePlayer.name);
    });

    it("returns a quit game action when given a quit command", () => {
        const command = new WumpusCommand(WumpusCommandType.Quit, []);
        const action = factory.createPlayerAction(command);
        expect(action.constructor.name).equals(QuitGame.name);
    });
});
