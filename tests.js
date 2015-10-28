var assert = require("chai").assert;

var asyncLatest = require('./index');

describe("parallel mode", function() {
	it("runs single function", function(done) {
		// Create a simple async function
		func = function(x, y, cb) {
			cb(null, x + y);
		};

		// Wrap it
		var func2 = asyncLatest(func);

		func2(3, 4, function (err, result) {
			assert.equal(result, 7);
			done();
		})
	});

	it("takes only latest call when reverse order completion", function(done) {
		var args = [];
		func = function(x, y, cb) {
			// Just save arguments
			args.push(arguments);
		};

		// Wrap it
		var func2 = asyncLatest(func);

		var first = null;
		var second = null;

		func2(3, 4, function (err, result) { first = result });
		func2(4, 5, function (err, result) { second = result });

		// Fire second one
		args[1][2](null, 9);
		assert.equal(second, 9);
		assert.equal(first, null);

		// Fire first one
		args[0][2](null, 7);
		assert.equal(second, 9);
		assert.equal(first, null);
		done();
	});

	it("passes correct arguments, overriding callback", function() {
		var args = [];
		func = function(x, y, cb) {
			// Just save arguments
			args.push(arguments);
		};

		// Wrap it
		var func2 = asyncLatest(func);

		var callback = function (err, result) { };
		func2(3, 4, callback);

		assert.equal(args[0][0], 3);
		assert.equal(args[0][1], 4);
		assert.notEqual(args[0][2], callback);
	});

});

describe("serial mode", function() {
	it("runs single function", function(done) {
		// Create a simple async function
		func = function(x, y, cb) {
			cb(null, x + y);
		};

		// Wrap it
		var func2 = asyncLatest(func, { serial: true });

		func2(3, 4, function (err, result) {
			assert.equal(result, 7);
			done();
		})
	});

	it("doesn't start second call until first completes", function(done) {
		var args = [];
		func = function(x, y, cb) {
			// Just save arguments
			args.push(arguments);
		};

		// Wrap it
		var func2 = asyncLatest(func, { serial: true });

		var first = null;
		var second = null;

		func2(3, 4, function (err, result) { first = result });
		func2(4, 5, function (err, result) { second = result });

		// Second not called
		assert.equal(args.length, 1);

		// Fire first one
		args[0][2](null, 7);
		assert.equal(second, null, "Should not be called");
		assert.equal(first, null, "Should not be called");

		// Fire second one
		args[1][2](null, 9);
		assert.equal(second, 9);
		assert.equal(first, null);

		done();
	});


	it("passes correct arguments, overriding callback", function() {
		var args = [];
		func = function(x, y, cb) {
			// Just save arguments
			args.push(arguments);
		};

		// Wrap it
		var func2 = asyncLatest(func, { serial: true });

		var callback = function (err, result) { };
		func2(3, 4, callback);

		assert.equal(args[0][0], 3);
		assert.equal(args[0][1], 4);
		assert.notEqual(args[0][2], callback);
	});

});