import readline from "readline";
import SelectionOption from "./SelectionOption.js";
import Logger from "./Logger.js";

export default class UserSelectionProvider {
    /**
     * @type {Logger}
     */
    #logger;

    constructor(logger) {
        this.#logger = logger;
    }

    /**
     * @param {Array<SelectionOption>} options
     * @param {function(SelectionOption): boolean} selectionListener
     * @returns {Promise<SelectionOption>}
     */
    provide({ options, selectionListener }) {
        return new Promise((resolve) => {
            this.#printOptions(options);

            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            const ask = () => {
                rl.question("Your selection: ", (anwser) => {
                    const selectedOption = options.find((option) => option.key === anwser);
                    if (selectedOption) {
                        if (!selectionListener || selectionListener(selectedOption) === true) {
                            rl.close();
                            resolve(selectedOption);   
                        } else {
                            ask();
                        }
                    } else {
                        this.#logger.log('Wrong option. Please try again.');
                        ask();
                    }
                });
            }
            ask();
        });
    }

    #printOptions(options) {
        options.forEach((option) => {
            this.#logger.log(`${option.key} - ${option.label}`);
        });
    }
}