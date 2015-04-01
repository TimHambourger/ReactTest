define(function (require) {

    var Promise = require('../lib/es6-promise-2.0.1').Promise;

    return Dispatcher;

    function Dispatcher() {
        var callbacks = {},
            currSubscriptionId = 0;

        return {
            subscribe: function (callback) {
                callbacks[currSubscriptionId] = callback;
                return currSubscriptionId++;
            },
            unsubscribe: function (subscriptionId) {
                delete callbacks[subscriptionId];
            },
            dispatch: function (payload) {
                var resolves = {},
                    rejects = {},
                    promises = {};

                for (var key in callbacks) {
                    promises[key] = new Promise(function (resolve, reject) {
                        resolves[key] = resolve;
                        rejects[key] = reject;
                    });
                }

                var callback;

                for (var key in callbacks) {
                    callback = callbacks[key];
                    // create a closure to remember current values for key and callback
                    (function (key, callback) {
                        Promise.resolve(callback(payload, after))
                        .then(
                            function (lastResolution) { resolves[key](lastResolution); },
                            function () { rejects[key](new Error('Failed callback for subscription id ' + key)); }
                        );
                    })(key, callback);
                }

                // TODO: Add cycle detection?
                function after(subscriptionIds, callback) {
                    var selectedPromises = subscriptionIds.map(function (id) {
                        if (promises[id] === undefined) throw new Error('There is no subscription with id ' + id);
                        return promises[id];
                    });

                    return Promise.all(selectedPromises).then(callback);
                }
            }
        }
    }
});