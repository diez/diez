import {Rule, RuleList} from '../src/targets/web.api';

describe('RuleList', () => {
  test('basic functionality', () => {
    const baseList = new RuleList([{
      selector: 'foo',
      declaration: {bar: 'baz'},
    }]);
    expect(baseList.serialize()).toEqual([{
      selector: 'foo',
      declaration: {bar: 'baz'},
    }]);

    const parentRule: Rule = {
      selector: 'alpha',
      declaration: {beta: 'gamma'},
      rules: baseList,
    };

    const parentList = new RuleList([parentRule]);

    expect(parentList.serialize()).toEqual([{
      selector: 'alpha',
      declaration: {beta: 'gamma'},
      rules: [{
        selector: 'foo',
        declaration: {bar: 'baz'},
      }],
    }]);

    parentList.deleteRule(parentRule);

    expect(parentList.serialize()).toEqual([]);
  });
});
