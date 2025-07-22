import Dice from "./Dice.js";
import DiceConfigurationResolver from "./DiceConfigurationResolver.js";
import FairNumberResolver from "./FairNumberResolver.js";
import Logger from "./Logger.js";
import Player from "./Player.js";
import WinProbabilityTablePrinter from "./WinProbabilityTablePrinter.js";
import SelectionOption, { EXIT_OPTION, HELP_OPTION } from "./SelectionOption.js";
import UserSelectionProvider from "./UserSelectionProvider.js";

export default class DiceGame {
    /**
     * @type {FairNumberResolver}
     */
    #fairNumberResolver;

    /**
     * @type {Logger}
     */
    #logger;

    /**
     * @type {Player}
     */
    #computer;

    /**
     * @type {Player}
     */
    #user;

    /**
     * @type {Array<Dice>}
     */
    #dices;

    /**
     * @type {Array<Dice>}
     */
    #availableDices;

    /**
     * @type {UserSelectionProvider}
     */
    #userSelectionProvider;

    /**
     * @type {WinProbabilityTablePrinter}
     */
    #winProbabilityTablePrinter;

    /**
     *  @type {DiceConfigurationResolver}
     */
    #diceConfigurationResolver;

    /**
     * @param {FairNumberResolver} fairNumberResolver 
     * @param {Logger} logger 
     * @param {UserSelectionProvider} userSelectionProvider 
     * @param {DiceConfigurationResolver} diceConfigurationResolver
     * @param {WinProbabilityTablePrinter} winProbabilityTablePrinter
     */
    constructor(
        fairNumberResolver, 
        logger, 
        userSelectionProvider, 
        diceConfigurationResolver, 
        winProbabilityTablePrinter
    ) {
        this.#fairNumberResolver = fairNumberResolver;
        this.#logger = logger;
        this.#userSelectionProvider = userSelectionProvider;
        this.#computer = new Player(true);
        this.#user = new Player(false);
        this.#diceConfigurationResolver = diceConfigurationResolver;
        this.#winProbabilityTablePrinter = winProbabilityTablePrinter;
        this.handleUserSelection = this.handleUserSelection.bind(this);
    }

    async run() {
        this.#dices = this.#diceConfigurationResolver.resolve();
        if (!this.#dices || this.#dices.length === 0) {
            return;
        }
        this.#availableDices = this.#dices.slice();

        await this.#determineFirstMover();

        await this.#determinePlayersDices();

        await this.#makeRolls();

        await this.#determineWinner();
    }

    async #determineFirstMover() {
        this.#logger.log("Let's determine who makes the first move.");

        const fairNumber = await this.#launchFairNumberResolver({
            max: 1, 
            message: "Try to guess my selection." 
        });
        this.#getPlayers()[fairNumber].setIsFirstMover();
    }

    #getPlayers() {
        return [this.#user, this.#computer].sort((a, b) => Number(b.isFirstMover()) - Number(a.isFirstMover()));
    }

    async #determinePlayersDices() {
        for (const player of this.#getPlayers()) {
            if (player.isComputer()) {
                await this.#determineComputerDice();
            } else {
                await this.#determineUserDice();
            }
        }
    }

    async #determineUserDice() {
        this.#logger.log('Choose your dice:');

        const result = await this.#userSelectionProvider.provide({
            options: this.#createUserSelectionOptions(
                this.#availableDices.map((dice, index) => new SelectionOption(index.toString(), dice.toString()))
            ),
            selectionListener: this.handleUserSelection
        });

        this.#user.setDice(this.#getAndRemoveDiceAt(parseInt(result.key)));

        this.#logger.log(`You choosed the ${this.#user.getDice()} dice.`);
    }

    async #determineComputerDice() {
        this.#logger.log("I choose dice.");

        const fairNumber = await this.#launchFairNumberResolver({
            max: this.#availableDices.length - 1
        });

        this.#computer.setDice(this.#getAndRemoveDiceAt(fairNumber));

        this.#logger.log(`I choosed the ${this.#computer.getDice()} dice.`);
    }

    async #makeRolls() {
        for (const player of this.#getPlayers()) {
            await this.#makeRoll(player);
        }
    }

    /**
     * @param {Player} currentPlayer
     */
    async #makeRoll(currentPlayer) {
        this.#logger.log(`It's time for ${currentPlayer.isComputer() ? "my" : "your"} roll.`);

        const fairNumber = await this.#launchFairNumberResolver({ max: DiceConfigurationResolver.DICE_FACE_COUNT - 1 });
        currentPlayer.makeRollOfDice(fairNumber);

        this.#logger.log(`${currentPlayer.isComputer() ? "My" : "Your"} roll result is ${currentPlayer.getScore()}`);
    }

    async #determineWinner() {
        const computerScore = this.#computer.getScore();
        const userScore = this.#user.getScore();

        if (computerScore > userScore) {
            this.#logger.log(`I won (${computerScore} > ${userScore})!`);
        } else if (computerScore < userScore) {
            this.#logger.log(`You won (${userScore} > ${computerScore})!`);
        } else {
            this.#logger.log(`Fair play (${computerScore} = ${userScore})!`);
        }
    }

    #createUserSelectionOptions(options) {
        return [...options, EXIT_OPTION, HELP_OPTION];
    }

    #createRangeSelectionOptions(max) {
        return this.#createUserSelectionOptions(this.#generateSelectionOptionsRange(max));
    }

    #generateSelectionOptionsRange(max) {
        return Array(max + 1).keys().map(i => new SelectionOption(i.toString()));
    }

    async #launchFairNumberResolver({ max, message }) {
        const mod = max + 1;
        return await this.#fairNumberResolver.resolve({
            message: message ? message : `Add your number modulo ${mod}.`,
            max,
            mod,
            userSelectionOptions: this.#createRangeSelectionOptions(max),
            userSelectionListener: this.handleUserSelection
        });
    }

    handleUserSelection(option) {
        switch (option.key) {
            case EXIT_OPTION.key:
                process.exit(0);

            case HELP_OPTION.key:
                this.#winProbabilityTablePrinter.print(this.#dices);
                return false;

            default:
                return true;
        }
    }

    #getAndRemoveDiceAt(index) {
        const dice = this.#availableDices[index];
        const i = this.#availableDices.indexOf(dice);
        this.#availableDices.splice(i, 1);
        return dice;
    }
}