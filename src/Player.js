import Dice from "./Dice.js";

export default class Player {
    /**
     * @type {Dice}
     */
    #dice = null;

    /**
     * @type {Number}
     */
    #score = 0;

    /**
     * @type {boolean}
     */
    #isComputer = false;

    /**
     * @type {boolean}
     */
    #isFirstMover = false;

    /**
     * @param {boolean} isComputer 
     */
    constructor(isComputer) {
        this.#isComputer = isComputer;
    }

    makeRollOfDice(index) {
        this.setScore(
            this.#dice.getFaceValueByIndex(index)
        );
    }

    getDice() {
        return this.#dice;
    }

    setDice(dice) {
        this.#dice = dice;
    }

    getScore() {
        return this.#score;
    }

    setScore(score) {
        this.#score = Number(score);
    }

    hasDice() {
        return this.#dice !== null;
    }

    isComputer() {
        return this.#isComputer;
    }

    setIsFirstMover() {
        this.#isFirstMover = true;
    }

    isFirstMover() {
        return this.#isFirstMover;
    }

    toString() {
        return `dice=${this.#dice} score=${this.#score} isFirstMover=${this.#isFirstMover} isComputer=${this.#isComputer}`;
    }
}