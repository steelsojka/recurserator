import { expect } from 'chai';

import entries from '../lib/entries';

describe('entries', () => {
  let data, results;

  beforeEach(() => {
    data = {
      key1: 123,
      key2: 456
    };

    results = [];
  });

  function verify() {
    expect(results[0]).to.eql(['key1', 123]);
    expect(results[1]).to.eql(['key2', 456]);
  }

  it('should call iterate over the items', () => {
    for (let item of entries(data)) {
      results.push(item);
    }

    verify();
  });

  it('should work with a spread', () => {
    results = [...entries(data)];
    verify();
  });
});
