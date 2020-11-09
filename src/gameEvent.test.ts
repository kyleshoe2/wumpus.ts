import { expect } from 'chai';
import * as sinon from 'sinon'
import * as tsSinon from 'ts-sinon'
import { WumpusCave } from './wumpusCave'
import { WumpusRoom } from './wumpusRoom'
import * as GameEvent from './gameEvent'
import { setRandomRangeFunction } from './wumpusRandom';

describe("GameEvent", () => {
    const roomNumber = 10;
    let cave: tsSinon.StubbedInstance<WumpusCave> = null;
    let randInt: sinon.SinonStub = null;

    beforeEach(() => {
        cave = tsSinon.stubInterface<WumpusCave>();
        randInt = sinon.stub();
        setRandomRangeFunction(randInt);
    });

    function setNextRoom(nextRoom: WumpusRoom, roomNumber: number, callNum: number = 0): void {
        cave.adjacentRoom.withArgs(roomNumber).returns(true);
        cave.getCurrentRoom.onCall(callNum).returns(nextRoom);    
    }

    describe("PlayerMovedToRoomEvents", () => {
        it("returns a hit wall event when the player tries to enter a non-adjacent room", () => {
            cave.adjacentRoom.withArgs(roomNumber).returns(false);     
    
            const movePlayer = new GameEvent.PlayerMovedToRoomEvent(roomNumber);
            const nextEvent = movePlayer.perform(cave);
    
            expect(nextEvent).instanceOf(GameEvent.PlayerHitWallEvent);
        });

        it("moves the player to the room when it's adjacent", () => {
            cave.adjacentRoom.withArgs(roomNumber).returns(true);     
    
            const movePlayer = new GameEvent.PlayerMovedToRoomEvent(roomNumber);
            const nextEvent = movePlayer.perform(cave);
    
            expect(cave.move.calledOnceWith(roomNumber)).equals(true);
            expect(nextEvent).instanceOf(GameEvent.PlayerEnteredRoomEvent);
        });
    });

    describe("PlayerEnteredRoomEvent", () => {
        it("returns a player idle event when the entered room has no bats or pits", () => {
            const currentRoom = tsSinon.stubInterface<WumpusRoom>();
            currentRoom.hasPit.returns(false);
            currentRoom.hasBats.returns(false);
            cave.getCurrentRoom.returns(currentRoom);
    
            const playerEnters = new GameEvent.PlayerEnteredRoomEvent();
            const nextEvent = playerEnters.perform(cave);
    
            expect(nextEvent).instanceOf(GameEvent.PlayerIdleEvent);
        });
    
        it("returns an entered pit room event when the player enters a room with a pit", () => {
            const currentRoom = tsSinon.stubInterface<WumpusRoom>();
            currentRoom.hasPit.returns(true);
            cave.getCurrentRoom.returns(currentRoom);
    
            const playerEnters = new GameEvent.PlayerEnteredRoomEvent();
            const nextEvent = playerEnters.perform(cave);
    
            expect(nextEvent).instanceOf(GameEvent.PlayerEnteredPitRoomEvent);
        });
    
        it("returns a moved by bats event when they enter a room with bats", () => {
            const currentRoom = tsSinon.stubInterface<WumpusRoom>();
            currentRoom.hasBats.returns(true);
            cave.getCurrentRoom.returns(currentRoom);
    
            const playerEnters = new GameEvent.PlayerEnteredRoomEvent();
            const nextEvent = playerEnters.perform(cave);
    
            expect(nextEvent).instanceOf(GameEvent.MovedByBatsEvent);
        });
    });
    
    describe("MovedByBatsEvent", () => {
        it("moves the player to a random room in the cave when they enter a room with bats", () => {
            const roomNumber = 10;
            const nextRoom = tsSinon.stubInterface<WumpusRoom>();
            nextRoom.hasBats.returns(true);
            setNextRoom(nextRoom, roomNumber);
    
            const movedByBats = new GameEvent.MovedByBatsEvent();
            const nextEvent = movedByBats.perform(cave);

            expect(nextEvent).instanceOf(GameEvent.PlayerEnteredRoomEvent);
            expect(cave.movePlayerToRandomRoom.calledOnce).equals(true);
        });

        // TODO Need to test and verify that this chains correctly with PlayerMovedToRoomEvent
    });

    describe("PlayerEnteredPitRoomEvent", () => {
        it("makes expect call to getRandomIntBetween", () => {
            const playerEnteredPitRoomEvent = new GameEvent.PlayerEnteredPitRoomEvent();

            playerEnteredPitRoomEvent.perform(cave);

            expect(randInt.calledOnceWith(0, 5)).equals(true);
        });

        it("returns a player survived pit event 1 out of 6 times", () => {
            const playerEnteredPitRoomEvent = new GameEvent.PlayerEnteredPitRoomEvent();

            randInt.returns(0);
            let nextEvent = playerEnteredPitRoomEvent.perform(cave);
            expect(nextEvent).instanceOf(GameEvent.PlayerSurvivedPitEvent);
        });

        it("returns a player fell in pit event 5 out of 6 times", () => {
            const playerEnteredPitRoomEvent = new GameEvent.PlayerEnteredPitRoomEvent();

            randInt.returns(1);
            let nextEvent = playerEnteredPitRoomEvent.perform(cave);
            expect(nextEvent).instanceOf(GameEvent.PlayerFellInPitEvent);

            randInt.returns(2);
            nextEvent = playerEnteredPitRoomEvent.perform(cave);
            expect(nextEvent).instanceOf(GameEvent.PlayerFellInPitEvent);

            randInt.returns(3);
            nextEvent = playerEnteredPitRoomEvent.perform(cave);
            expect(nextEvent).instanceOf(GameEvent.PlayerFellInPitEvent);

            randInt.returns(4);
            nextEvent = playerEnteredPitRoomEvent.perform(cave);
            expect(nextEvent).instanceOf(GameEvent.PlayerFellInPitEvent);

            randInt.returns(5);
            nextEvent = playerEnteredPitRoomEvent.perform(cave);
            expect(nextEvent).instanceOf(GameEvent.PlayerFellInPitEvent);
        });
    });

    describe("PlayerFellInPitEvent", () => {
        it("returns a game over event", () => {
            const playerFellInPit = new GameEvent.PlayerFellInPitEvent();

            const nextEvent = playerFellInPit.perform(cave);

            expect(nextEvent).instanceOf(GameEvent.GameOverEvent);
        });
    });
});

