import {expect} from 'chai';
import parse from '../lib/form/parser.js';

describe("Parser", function () {

  it("Should parse simple identifiers", function () {
    expect(parse('test')).to.deep.equal([
      { identifier: 'test'}
    ]);
  });

  it("Should parse joined identifiers", function () {
    expect(parse('test.test')).to.deep.equal([
      { identifier: 'test'},
      { identifier: 'test'}
    ]);
  });

  it("Should allow white space in identifiers", function () {
    expect(parse('test test')).to.deep.equal([
      { identifier: 'test test'}
    ]);
  });

	/*var result = require('inject!../lib/tested.js')({
		'./App.js': {}
	});*/
});
