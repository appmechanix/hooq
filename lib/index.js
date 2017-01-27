const request = require('request');

function HooqQueue(options) {
    var self = this;

    self.defaults = {
        interval: 5,
        take: 1,
        timeout: 5,
        server: 'hooq.io',
        protocol: 'http'
    };

    if (!options.apiKey) {
        throw "Hooq apiKey not set";
    }

    if (!options.queueKey) {
        throw "Hooq queueKey not set";
    }

    self.options = options;

    for (var item in self.defaults) {
        if (!self.options[item]) {
            self.options[item] = self.defaults[item];
        }
    }

    if (self.options.interval < 1) {
        throw "interval too low - can't check more than once per second";
    }

    /**
     * Sets up a queue watcher
     * @param hasMessagesCallback Invoked when there's new messages
     * @param noMessagesCallback Invoked when no new messages
     * @param errorCallback
     */
    self.watch = function (hasMessagesCallback, noMessagesCallback, errorCallback) {
        self.watcher = setInterval(function () {
            CheckQueue(hasMessagesCallback, noMessagesCallback, errorCallback);
        }, self.options.interval * 1000);
    };

    /**
     * Stops the queue watcher
     */
    self.stop = function () {
        clearInterval(self.watcher);
    };

    function CheckQueue(hasMessagesCallback, noMessagesCallback, errorCallback) {
        request(
            self.options.protocol
            + '://'
            + self.options.server
            + '/out/'
            + self.options.apiKey
            + '/'
            + self.options.queueKey
            + '?take=' + self.options.take
            + '&timeout=' + self.options.timeout,
            function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    if (errorCallback) {
                        errorCallback(error);
                    } else {
                        console.error("Server returned", response.statusCode);
                    }

                    return;
                }

                var responseBody = JSON.parse(body);

                if (responseBody.length === 0) {
                    if (noMessagesCallback) {
                        noMessagesCallback();
                    }
                    return;
                }

                for (var i = 0; i < responseBody.length; i++) {
                    ProcessItem(responseBody[i], hasMessagesCallback);
                }
            }
        );
    }

    function ProcessItem(message, hasMessageCallback) {
        var webhookObject = JSON.parse(message.messagetext);

        function _callback() {
            MarkItemAsDone(message);
        }

        hasMessageCallback(webhookObject, _callback);
    }

    function MarkItemAsDone(message) {
        request.delete(self.options.protocol + '://' + self.options.server + '/out/' + self.options.apiKey + '/' + self.options.queueKey + '/' + message.messageid + '/' + message.popreceipt);
    }
}

module.exports = HooqQueue;