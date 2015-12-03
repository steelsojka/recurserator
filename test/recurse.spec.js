import { expect } from 'chai';

import recurse from '../lib/recurse';

describe('recurse', () => {
  let data, results;

  beforeEach(() => {
    data = {
      children: [{
      }, {
        children: [{
        }]
      }]
    };

    results = [];
  });

  function verify() {
    expect(results[0]).to.equal(data);
    expect(results[1]).to.equal(data.children[0]);
    expect(results[2]).to.equal(data.children[1]);
    expect(results[3]).to.equal(data.children[1].children[0]);
  }

  it('should call iterate over the items', () => {
    for (let item of recurse(item => item.children, data)) {
      results.push(item);
    }

    verify();
  });

  it('should work with a spread', () => {
    results = [...recurse(item => item.children, data)];
    verify();
  });
});
