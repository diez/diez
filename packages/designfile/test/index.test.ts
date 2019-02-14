import {canParse} from '../src/';

describe('#canParse', () => {
  test('return `true` for supported parsers', () => {
    expect(canParse('mysketch.sketch')).toBe(true);
    expect(canParse('myilustrator.ai')).toBe(true);
    expect(canParse('http://figma.com/file/id/')).toBe(true);
  });
});
