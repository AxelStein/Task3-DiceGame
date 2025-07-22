import AsciiTable from "ascii-table";
import Logger from "./Logger.js";
import Dice from "./Dice.js";

export default class WinProbabilityTablePrinter {
    /**
     * @type {Logger}
     */
    #logger;

    constructor(logger) {
        this.#logger = logger;
    }

    /**
     * @param {Array<Dice>} dices 
     */
    print(dices) {
        const table = new AsciiTable('Win probability table');
        const diceTitles = dices.map(d => d.toString());
        
        table.setHeading('User dice', ...diceTitles);
        dices.forEach((current, i) => {
            const data = [];
            dices.forEach((d, j) => {
                if (i === j) {
                    data.push("-");
                } else {
                    data.push(this.#calculateWinProbability(current.getFaces(), d.getFaces()));
                }
            });
            table.addRow(diceTitles[i], ...data);
        })
        
        this.#logger.log(table.toString())
    }

    /**
     * @param {Array<Number>} a 
     * @param {Array<Number>} b 
     * @returns {Number}
     */
    #calculateWinProbability(a, b) {
        let n = 0;
        a.forEach(x => {
            b.forEach(y => {
                if (x > y) n++;
            });
        });
        return (n / (a.length * b.length)).toFixed(4).substring(1);
    }
}