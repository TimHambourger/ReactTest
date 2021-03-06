var Promise = require('es6-promise').Promise,
    keys = Object.keys || function (obj) {
        var out = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) out.push[key];
        }
        return out;
    };

module.exports = Dispatcher;

function Dispatcher(args) {
    args = args || {};

    var evts = {},
        currSubscriptionId = 0,
        warnOnHungSubscriptionAfter = (args.warnOnHungSubscriptionAfter !== undefined) ? args.warnOnHungSubscriptionAfter : 200,
        warnOnSubscriptionRejection = (args.warnOnSubscriptionRejection !== undefined) ? args.warnOnSubscriptionRejection : true;

    return {
        subscribe: function (evtName, callback) {
            evts[evtName] = evts[evtName] || {};
            evts[evtName][currSubscriptionId] = callback;
            return currSubscriptionId++;
        },
        unsubscribe: function (evtName, subscriptionId) {
            if (evts[evtName] === undefined) return;
            delete evts[evtName][subscriptionId];
            if (keys(evts[evtName]).length === 0)
                delete evts[evtName];
        },
        dispatch: function (evtName, payload) {
            var callbacks = evts[evtName] || {},
                resolves = {},
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

            if (warnOnHungSubscriptionAfter !== null) {
                // Warning is an indirect way of detecting cycles
                warnTimeout = setTimeout(function () {
                    var warning = 'Not all dispatch subscribers completed in the expected time. '
                        + 'The following subscription IDs have hung: ',
                        remainingKeys = keys(isRemaining);
                    warning += remainingKeys.join(',');
                    console.warn(warning);
                }, warnOnHungSubscriptionAfter);

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
                            if (warnOnSubscriptionRejection)
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
                    if (promises[id] === undefined) throw new Error('There is no subscription with id ' + id + ' for event ' + evtName);
                    return promises[id];
                });

                return Promise.all(selectedPromises);
            }
        }
    }
}
