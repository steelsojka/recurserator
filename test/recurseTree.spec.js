import { expect } from 'chai';
import isObject from 'lodash.isobject';

import recurseTree from '../lib/recurseTree';

describe('recurseTree', () => {
  let data, results;

  beforeEach(() => {
    data = {
      prop: {
        nested: {}
      },
      test: [{}],
      bool: false
    };

    results = [];
  });

  function verify() {
    expect(results[0]).to.eql(['prop', data.prop, 'prop', data]);
    expect(results[1]).to.eql(['nested', data.prop.nested, 'prop.nested', data.prop]);
    expect(results[2]).to.eql(['test', data.test, 'test', data]);
    expect(results[3]).to.eql([0, data.test[0], 'test[0]', data.test]);
  }

  it('should call iterate over the items', () => {
    for (let item of recurseTree(data, isObject)) {
      results.push(item);
    }

    verify();
  });

  it('should work with a spread', () => {
    results = [...recurseTree(data, isObject)];
    verify();
  });
});
