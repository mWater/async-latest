
module.exports = function(asyncFunc, options) {
	if (options && options.serial) {
		var inProgress = false;
		var pending = null;

		return function() {
			// If in progress, set pending and return
			if (inProgress) {
				pending = arguments;
				return;
			}

			// Set inProgress
			inProgress = true;

			// Process arguments and call 
			function process(args) {
				// Copy args
				var argsCopy = [];
				for (var i = 0; i < args.length; i++) {
					argsCopy.push(args[i]);
				}
				var callback = argsCopy[argsCopy.length - 1];

				newCallback = function() {
					// If pending, ignore result and call pending
					if (pending) {
						// Reset pending
						var pendingCopy = pending;
						pending = null;
						return process(pendingCopy);
					}
					else {
						inProgress = false;
						callback.apply(null, arguments);
					}
				};

				argsCopy[argsCopy.length - 1] = newCallback;
				asyncFunc.apply(null, argsCopy);
			};

			process(arguments);
		}
	}
	else {
		var callNum = 0;

		// Non-serial. Only take latest call
		return function() {
			// Save call number for this function
			callNum++;
			var myCallNum = callNum;

			// Call function with args, but replace callback function
			var args = [];
			for (var i = 0; i< arguments.length - 1; i++) {
				args[i] = arguments[i];
			}
			callback = arguments[arguments.length - 1];

			var newCallback = function() {
				// If not latest call, ignore
				if (myCallNum != callNum)
					return;

				// Call callback
				callback.apply(null, arguments);
			};

			// Call function with new callback
			args.push(newCallback);
			asyncFunc.apply(null, args);
		}
	}
}