import { expect } from 'chai'
import * as tsSinon from 'ts-sinon'
import { WumpusCave } from './wumpusCave'
import { Game } from './game'
import { PlayerAction } from './playerAction'
import { GameEventDisplay } from './GameEventDisplay'
import { PlayerActionTranslator } from './playerActionTranslator'
import { GameState } from './gameState'


describe("Game", () => {
    let cave: tsSinon.StubbedInstance<WumpusCave> = null;
    let gameState: GameState = null;
    let playerActionTranslator: tsSinon.StubbedInstance<PlayerActionTranslator> = null;
    let gameEventDisplay: tsSinon.StubbedInstance<GameEventDisplay> = null;
    let game: Game = null;

    beforeEach(() => {
        cave = tsSinon.stubInterface<WumpusCave>();
        gameState = new GameState(cave);
        playerActionTranslator = tsSinon.stubInterface<PlayerActionTranslator>();
        gameEventDisplay = tsSinon.stubInterface<GameEventDisplay>();
        game = new Game(gameState, playerActionTranslator, gameEventDisplay);
    });

    function setPlayerAction(playerAction: PlayerAction, callNumber: number = 0): void {
        const promise = new Promise<PlayerAction>(resolve => { 
            resolve(playerAction)
        });

        playerActionTranslator.getPlayerAction.onCall(callNumber).returns(promise)
    }

    it("displays the game state at the start", async () => {
        const playerAction = tsSinon.stubInterface<PlayerAction>();
        playerAction.perform.returns(false);
        setPlayerAction(playerAction);

        await game.run();

        expect(gameEventDisplay.displayGameState.calledOnceWith(gameState)).equals(true)
    });

    it("stops running after the first action returns false", async () => {
        const playerAction = tsSinon.stubInterface<PlayerAction>();
        playerAction.perform.returns(false);
        setPlayerAction(playerAction);

        await game.run();

        expect(playerActionTranslator.getPlayerAction.calledOnce).equals(true);
    });

    it("stops running after the third action returns false", async () => {
        const playerAction = tsSinon.stubInterface<PlayerAction>();
        playerAction.perform.onFirstCall().returns(true);
        setPlayerAction(playerAction, 0);

        playerAction.perform.onSecondCall().returns(true);
        setPlayerAction(playerAction, 1);

        playerAction.perform.onThirdCall().returns(false);
        setPlayerAction(playerAction, 2);

        await game.run();

        expect(playerActionTranslator.getPlayerAction.calledThrice).equals(true);
    });
});
