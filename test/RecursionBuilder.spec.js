import { expect } from 'chai';
import isObject from 'lodash.isobject';

import RecursionBuilder from '../lib/RecursionBuilder';

describe('RecursionBuilder', () => {
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
    for (let item of RecursionBuilder.create(data, { yield: isObject })) {
      results.push(item);
    }

    verify();
  });

  it('should work with a spread', () => {
    results = [...RecursionBuilder.create(data, { yield: isObject })];
    verify();
  });

  it('should extract keys', () => {
    results = [...RecursionBuilder.create(data).keys()];

    expect(results).to.eql(['prop', 'nested', 'test', 0, 'bool']);
  });

  it('should extract paths', () => {
    results = [...RecursionBuilder.create(data).paths()];

    expect(results).to.eql(['prop', 'prop.nested', 'test', 'test[0]', 'bool']);
  });

  it('should extract values', () => {
    results = [...RecursionBuilder.create(data).values()];

    expect(results).to.eql([data.prop, data.prop.nested, data.test, data.test[0], data.bool]);
  });
});
