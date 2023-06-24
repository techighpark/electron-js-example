/**
 * @function
 * @name jsDocName
 * See {@link https://jsdoc.app/tags-name.html}
 */
function jsDoc() {

}



/**
 * @namespace MyNamespace
 */
const MyNameSpace = {
    /** documented as MyNameSpace.foo */
    foo: function () { },
    /** documented as MyNameSpace.bar */
    bar: 1,
}

/**
 * A function in MyNamespace (MyNamespace.myFunction).
 * @function myFunction
 * @memberof MyNamespace
 */
function namespaceFunction() {

}


/**
 * Enum for tri-state values.
 * @readonly
 * @enum {number}
 */
var triState = {
    /** The true value */
    TRUE: 1,
    FALSE: -1,
    /** @type {boolean} */
    MAYBE: true
};

/**
 * @namespace
 * @property {object}  defaults               - The default values for parties.
 * @property {number}  defaults.players       - The default number of players.
 * @property {string}  defaults.level         - The default level for the party.
 * @property {object}  defaults.treasure      - The default treasure.
 * @property {number}  defaults.treasure.gold - How much gold the party starts with.
 */
var config = {
    defaults: {
        players: 1,
        level: 'beginner',
        treasure: {
            gold: 0
        }
    }
};


/**
 * User type definition
 * @typedef {Object} User
 * @property {string} email
 * @property {string} [nickName]
 */
/**
 * @param {User.email} email
 */
function typeDefFunction(email) {

}

/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} NumberLike
 */

/**
 * Set the magic number.
 * @param {NumberLike} x - The magic number.
 */
function setMagicNumber(x) {
}

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} WishGranter~Triforce
 * @property {boolean} hasCourage - Indicates whether the Courage component is present.
 * @property {boolean} hasPower - Indicates whether the Power component is present.
 * @property {boolean} hasWisdom - Indicates whether the Wisdom component is present.
 */

/**
 * A class for granting wishes, powered by the Triforce.
 * @class
 * @param {...WishGranter~Triforce} triforce - One to three {@link WishGranter~Triforce} objects
 * containing all three components of the Triforce.
 */
function WishGranter(triforce) { }




/**
 * The Widget namespace.
 * @namespace Widget
 */

// you can also use '@class Widget(2)' and omit the @variation tag
/**
 * The Widget class. Defaults to the properties in {@link Widget.properties}.
 * @class
 * @variation 2
 * @param {Object} props - Name-value pairs to add to the widget.
 */
function Widget(props) { }

/**
 * Properties added by default to a new {@link Widget(2)} instance.
 */
Widget.properties = {
    /**
     * Indicates whether the widget is shiny.
     */
    shiny: true,
    /**
     * Indicates whether the widget is metallic.
     */
    metallic: true
};