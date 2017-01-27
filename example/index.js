var lib = require('../lib');

var queueProcessor = new lib(
    {
        apiKey: 'http://hooq.io/app/#/settings',
        queueKey: 'http://hooq.io/app/#/queues',
    }
);

queueProcessor.watch(
    function (webhook, done) {
        console.log("Message received!");
        console.log(webhook);
        done();
    },
    function () {
        console.log("No messages");
    },
    function (err) {
        console.log("There has been an error", err);
    }
);