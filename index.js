import container from "./src/container.js";

const logger = container.resolve("logger");
container.resolve("diceGame")
    .run()
    .catch(e => logger.error(`Error occurred`));