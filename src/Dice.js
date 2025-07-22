export default class Dice {
    #faces;

    /**
     * @param {Array<number>} faces 
     */
    constructor(faces) {
        this.#faces = faces;
    }

    getFaces() {
        return this.#faces;
    }

    getFaceValueByIndex(index) {
        return this.#faces[index];
    }

    toString() {
        return `[${this.#faces}]`;
    }
}