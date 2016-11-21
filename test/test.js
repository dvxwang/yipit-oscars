// Sample testing framework
// Note: for brevity, not all functions in helpers are tested

var assert = require('assert');
var helper = require ('../server/helpers.js');

describe('Helper Functions', function() {
  
	describe('cleanYear()', function() {
		it('should remove whitespaces and content in brackets/parentheses', function() {
			assert.equal(helper.cleanYear("1927 / 28 [A] (1st)"), "1927/28");
			assert.equal(helper.cleanYear("1936 (9th)"), "1936");
		});
	});

	describe('cleanTitle()', function() {
		it('should remove trailing whitespaces and content in brackets', function() {
			assert.equal(helper.cleanTitle("It Happened One Night [I]"), "It Happened One Night");
			assert.equal(helper.cleanTitle("Gentleman's Agreement"), "Gentleman's Agreement");
		});
	});

	describe('cleanBracketHyphen()', function() {
		it('should remove content in brackets, estimations, and standardize hyphens', function() {
			assert.equal(helper.cleanBracketHyphen("$6–7 million [ 1 ] [ 2 ]"), "$6-7 million  ");
			assert.equal(helper.cleanBracketHyphen("US$1,644,736 (est.)"), "US$1,644,736 ");
		});
	});

	describe('addCommas()', function() {
		it('should format budget into monetary format', function() {
			assert.equal(helper.addCommas("16625684"), "$16,625,684");
			assert.equal(helper.addCommas('"N/A"'), "N/A");
			assert.equal(helper.addCommas(null), "N/A");
		});
	});

});