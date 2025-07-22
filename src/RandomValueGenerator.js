import crypto from "crypto";

export default class RandomValueGenerator {

    /**
     * @param {Number} max 
     */
    generate(max) {
        return new Promise((resolve, reject) => {
            try {
                const computerValue = this.#generateRandomValue(max);
                const key = this.#generateSecretKey();
                const hmac = this.#calculateHmacFromValue(key, computerValue);
                resolve({ 
                    computerValue, 
                    key: key.export().toString('hex'), 
                    hmac 
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    #generateRandomValue(max) {
        return crypto.randomInt(max + 1);
    }

    #generateSecretKey() {
        return crypto.generateKeySync('hmac', { length: 256 });
    }

    #calculateHmacFromValue(key, value) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(value.toString());
        return hmac.digest('hex');
    }
}