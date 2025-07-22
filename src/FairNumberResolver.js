import Logger from "./Logger.js";
import RandomValueGenerator from "./RandomValueGenerator.js";
import UserSelectionProvider from "./UserSelectionProvider.js";

export default class FairNumberResolver {
    /**
     * @type {RandomValueGenerator}
     */
    #randomValueGenerator;

    /**
     * @type {UserSelectionProvider}
     */
    #userSelectionProvider;

    /**
     * @type {Logger}
     */
    #logger;

    constructor(randomValueGenerator, userSelectionProvider, logger) {
        this.#randomValueGenerator = randomValueGenerator;
        this.#userSelectionProvider = userSelectionProvider;
        this.#logger = logger;
    }

    resolve({ message, max, mod, userSelectionOptions, userSelectionListener }) {
        return new Promise(async (resolve, reject) => {
            try {
                const { computerValue, key, hmac } = await this.#randomValueGenerator.generate(max);

                this.#logger.log(`I selected a random value in the range 0..${max}`);
                this.#logger.log(`HMAC=${hmac}`);
                this.#logger.log(message);

                const userSelection = await this.#userSelectionProvider.provide({
                    options: userSelectionOptions,
                    selectionListener: userSelectionListener
                });
                this.#logger.log(`My selection: ${computerValue} (KEY=${key}).`);

                const userValue = parseInt(userSelection.key);
                const fairNumber = (computerValue + userValue) % mod;
                this.#logger.log(`The fair number generation result is ${computerValue} + ${userValue} = ${fairNumber} (mod ${mod}).`);

                resolve(fairNumber);
            } catch (e) {
                reject(e);
            }
        });
    }
}