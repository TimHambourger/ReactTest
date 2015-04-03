define(function (require) {

    var Promise = require('../lib/es6-promise-2.0.1').Promise;

    return Dispatcher;

    function Dispatcher() {
        var callbacks = {},
            currSubscriptionId = 0,
            warnAfter = 200,
            maxWarns = 50,
            warnsSoFar = 0;

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
                    promises = {},
                    isRemaining = {};

                for (var key in callbacks) {
                    promises[key] = new Promise(function (resolve, reject) {
                        resolves[key] = resolve;
                        rejects[key] = reject;
                    });
                    isRemaining[key] = true;
                }

                var warnTimeout;

                if (warnsSoFar <= maxWarns) {
                    // Warning is an indirect way of detecting cycles
                    warnTimeout = setTimeout(function () {
                        // need to do another check for maxWarns since there's a chance too many dispatches will have
                        // been let in given the asynchrony of the warn
                        if (warnsSoFar >= maxWarns) return;
                        var warning = 'Not all dispatch subscribers completed in the expected time. '
                            + 'The following subscription IDs have hung: ',
                            remainingKeys = [];
                        for (var key in isRemaining) {
                            remainingKeys.push(key);
                        }
                        warning += remainingKeys.join(',');
                        console.warn(warning);
                        warnsSoFar++;
                    }, warnAfter);

                    var promiseArray = [];
                    for (var key in promises) {
                        promiseArray.push(promises[key]);
                    }

                    Promise.all(promiseArray).then(cancelWarn, cancelWarn);
                }

                var callback;

                for (var key in callbacks) {
                    callback = callbacks[key];
                    // create a closure to remember current value for key
                    (function (key) {
                        Promise.resolve(callback(payload, waitFor))
                        .then(
                            function (lastResolution) { resolves[key](lastResolution); },
                            function (e) {
                                console.warn('Error for subscription ID ' + key + '. ' + (e.stack || e));
                                rejects[key](e);
                            }
                        ).then(function () { delete isRemaining[key]; });
                    })(key);
                }

                function cancelWarn() {
                    clearTimeout(warnTimeout);
                }

                function waitFor(subscriptionIds) {
                    var selectedPromises = subscriptionIds.map(function (id) {
                        if (promises[id] === undefined) throw new Error('There is no subscription with id ' + id);
                        return promises[id];
                    });

                    return Promise.all(selectedPromises);
                }
            }
        }
    }
});