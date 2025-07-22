import Dice from "./Dice.js";
import Logger from "./Logger.js";
import Joi from "joi";

export default class DiceConfigurationResolver {
    /**
     * @type {Logger}
     */
    #logger;

    static DICE_FACE_COUNT = 6;

    constructor(logger) {
        this.#logger = logger;
    }

    #isInvalidValue(schema, value) {
        const { error } = schema.validate(value);
        if (error) {
            this.#logger.error(error.details[0].message);
            return true;
        }
        return false;
    }

    resolve() {
        const input = process.argv.slice(2);

        const inputCountSchema = Joi.array()
            .min(3)
            .items(Joi.string())
            .required()
            .messages({
                "array.min": "Enter at least {#limit} dices"
            });

        const diceFacesSchema = Joi
            .array()
            .length(DiceConfigurationResolver.DICE_FACE_COUNT)
            .items(
                Joi.number()
                    .integer()
                    .min(1)
                    .required()
            )
            .required()
            .messages({
                "number.base": "Face '{#value}' must be a number",
                "number.min": "Face '{#value}' must be greater than {#limit}",
                "number.integer": "Face '{#value}' must be integer",
                "array.length": "Dice '{#value}' must contain {#limit} faces"
            });

        if (this.#isInvalidValue(inputCountSchema, input)) {
            return;
        }

        const dices = [];

        for (const s of input) {
            const faces = s.split(',');
            if (this.#isInvalidValue(diceFacesSchema, faces)) {
                return;
            }
            dices.push(new Dice(faces.map(n => Number(n))));
        }
        
        return dices;
    }
}