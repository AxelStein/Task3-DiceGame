export default class SelectionOption {
    /**
     * @type {string}
     */
    key;

    /**
     * @type {string}
     */
    label;

    /**
     * @param {string} key 
     * @param {string} label 
     */
    constructor(key, label) {
        this.key = key;
        this.label = label ? label : key;
    }
}

export const EXIT_OPTION = new SelectionOption('X', 'Exit');
export const HELP_OPTION = new SelectionOption('?', 'Help');