# hooq
Hooq queueing library - for use with Hooq Queues.

### Installing

```npm install hooq --save```

### Using

The library automatically sets up a interval that watches for new items on the queue.

```
var hooq = require('hooq');

var queueProcessor = new hooq(
    {
        apiKey: 'Your API Key',
        queueKey: 'Your queue key',
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
```

### Methods

```new Hooq(options)```

Used to setup the Hooq library.

```watch(haveMessageCallback, noMessageCallback, errorCallback)```

These are words

### Options

Options are passed in when creating your Hooq object

#### Required
* ```apiKey``` - Your API key
* ```queueKey``` - Your queue key

#### Optional
* ```interval``` - How often to check for new items, in seconds (default 5 seconds, min 1 second)
* ```take``` - Number of items to get at a time (default 1)
* ```timeout``` - How long the items should stay hidden in the queue before appear again (default 5 minutes)
* ```server``` - Hooq server URL
* ```protocol``` - Protocol to use (http/https)
