import { createContainer, asClass, InjectionMode } from "awilix";
import Logger from "./Logger.js";
import UserSelectionProvider from "./UserSelectionProvider.js";
import FairNumberResolver from "./FairNumberResolver.js";
import RandomValueGenerator from "./RandomValueGenerator.js";
import DiceGame from "./DiceGame.js";
import DiceConfigurationResolver from "./DiceConfigurationResolver.js";
import WinProbabilityTablePrinter from "./WinProbabilityTablePrinter.js";

const container = createContainer({ injectionMode: InjectionMode.CLASSIC });
container.register({
    logger: asClass(Logger).singleton(),
    userSelectionProvider: asClass(UserSelectionProvider),
    fairNumberResolver: asClass(FairNumberResolver),
    randomValueGenerator: asClass(RandomValueGenerator),
    diceConfigurationResolver: asClass(DiceConfigurationResolver),
    winProbabilityTablePrinter: asClass(WinProbabilityTablePrinter),
    diceGame: asClass(DiceGame)
});
export default container;