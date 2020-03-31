const pangrams = [
  'Five quacking zephyrs jolt my wax bed',
  'Sphinx of black quartz, judge my vow',
  'Two driven jocks help fax my big quiz',
  'Quick zephyrs blow, vexing daft Jim',
  'The five boxing wizards jump quickly',
  'Pack my box with five dozen liquor jugs',
  'Jinxed wizards pluck ivy from the big quilt',
  'Crazy Fredrick bought many very exquisite opal jewels',
  'We promptly judged antique ivory buckles for the next prize',
  'A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent',
  'Jaded zombies acted quaintly but kept driving their oxen forward',
  'The job requires extra pluck and zeal from every young wage earner',
];

/**
 * Deterministically provides a random pangram for a provided string.
 */
export const getPangram = (key: string) => {
  return pangrams[hashString(key) % pangrams.length];
};

/**
 * Hash a string into a positive number.
 */
const hashString = (str: string) => {
  return Math.abs(Array.from(str).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0));
};
