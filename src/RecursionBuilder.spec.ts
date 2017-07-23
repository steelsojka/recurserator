import { expect } from 'chai';

import { RecursionBuilder } from './RecursionBuilder';

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

  function assertObject(actual: any, expected: any): void {
    expect(actual.key).to.equal(expected.key);
    expect(actual.value).to.equal(expected.value);
    expect(actual.path).to.equal(expected.path);
    expect(actual.parent).to.equal(expected.parent);
    expect(actual.previous).to.equal(expected.previous);
  }

  function verify() {
    assertObject(results[0], {
      key: 'prop',
      value: data.prop,
      path: 'prop',
      parent: data,
      previous: null
    });

    assertObject(results[1], {
      key: 'nested',
      value: data.prop.nested,
      path: 'prop.nested',
      parent: data.prop,
      previous: results[0]
    });

    assertObject(results[2], {
      key: 'test',
      value: data.test,
      path: 'test',
      parent: data,
      previous: null
    });

    assertObject(results[3], {
      key: 0,
      value: data.test[0],
      path: 'test[0]',
      parent: data.test,
      previous: results[2]
    });
  }

  it('should call iterate over the items', () => {
    for (let item of RecursionBuilder.create(data)) {
      results.push(item);
    }

    verify();
  });

  it('should work with a spread', () => {
    results = [...RecursionBuilder.create(data)];
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

  it('should set the yield fn', () => {
    results = [
      ...RecursionBuilder.create(data).yieldOn(v => typeof v === 'boolean')
    ];

    assertObject(results[0], {
      key: 'bool',
      value: false,
      path: 'bool',
      parent: data,
      previous: null
    });
  });

  describe('when extracting recursion keys', () => {
    let data;

    beforeEach(() => {
      data = {
        children: [{}, { children: [ {} ] }]
      }      
    });  

    it('should recurse all the items', () => {
      const builder = RecursionBuilder.create([ data ])  
        .readNext('children')
        .traverseOn(i => typeof i === 'object');

      const result = [ ...builder.values() ];

      expect(result.length).to.equal(4)
    });
  });

  describe('when yielding the last result', () => {
    it('should yield the correct previous value', () => {
      const builder = RecursionBuilder.create({
        test: {
          skipped: {
            blorg: true
          }
        }
      })
        .yieldOn((value, key) => key !== 'skipped');

      const results = [ ...builder ];

      expect(results.length).to.equal(2);
      expect(results[0].previous).to.be.null;
      expect(results[1].key).to.equal('blorg');
      expect(results[1].previous).to.equal(results[0]);
    });
  });
});
