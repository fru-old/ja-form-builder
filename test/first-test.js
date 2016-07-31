import {expect} from 'chai';
import parse from '../lib/form/parser.js';

describe("Parser", function () {

  it("Should parse simple identifiers", function () {
    expect(parse('test.test.test')).to.deep.equal([
      { identifier: ['test', 'test', 'test'], root: '$data' }
    ]);
  });

  it("Should parse $ context variables", function () {
    expect(parse('$root.test.test')).to.deep.equal([
      { identifier: ['test', 'test'], root: '$root' }
    ]);
    expect(parse('$parent.test.test')).to.deep.equal([
      { identifier: ['test', 'test'], root: '$parents', index: 0 }
    ]);

    expect(parse('$parents[3].test.test')).to.deep.equal([
      { identifier: ['test', 'test'], root: '$parents', index: 3 }
    ]);
  });

  it("Should preserve spacing between operators", function () {
    expect(parse('+ !!true')).to.deep.equal([
      { operator: '+'},
      { space: true },
      { operator: '!'},
      { operator: '!'},
      { constant: 'true' }
    ]);
  });

  it("Should parse sub expressions", function () {

    var subExpression = [
      { identifier: ['test', 'test'], root: '$data' }
    ];
    expect(parse('test.test')).to.deep.equal(subExpression);
    console.log(JSON.stringify(parse('test.test.test()()'), null, 4));

    /*expect(parse('test[test.test]')).to.deep.equal([
      { identifier: [
        'test',
        [{ expression: subExpression }]
      ]}
    ]);*/
  });

  /*
  console.log(JSON.stringify(parse('test("test" , 124, true)')));
    it("Should recognize function calls and constants", function () {
      expect(parse('test.test(test.test, "test", 123, true)')).to.deep.equal([
        { call: ['test', 'test'], args: [
          { identifier: ['test', 'test'], root: '$data' },
          { string: '"test"' },
          { number: '123' },
          { constant: 'true' }
        ]}
      ]);
    });
    */

	/*var result = require('inject!../lib/tested.js')({
		'./App.js': {}
	});*/
});
