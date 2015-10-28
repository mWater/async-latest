# Async Latest

When you want the latest response from an async function, not stale ones.

Let's say you have a search box which generates search events. The search is asynchronous and you don't want to show incorrect results if an older response takes longer than a newer one. That is, searching for "Appl" generates some results, but the callback comes *after* the callback for "Apple" which the user has now typed. You don't want to show the results for "Appl" but rather silently discard them.

This is also useful for React.js when you update state asynchronously based on props. You want to keep the state in sync with the props at all time and by wrapping the update function with this tool, it will.

Example:

```
var asyncLatest = require('async-latest');

// Simple async adding function
var myAsyncFunction = function(a, b, callback) { 
	setTimeout(function() { callback(null, a + b); }, 1000); 
};

// Wrap it
var wrappedAsyncFunction = asyncLatest(myAsyncFunction);

// Now the callback will not be called with stale data!

```

## Options

You can pass `{ serial: true }` as second parameter to force async calls to be run one at a time. It will only keep most recent call pending and then execute it when the currently running async call has completed. Useful when you don't want to overload the server with async calls.