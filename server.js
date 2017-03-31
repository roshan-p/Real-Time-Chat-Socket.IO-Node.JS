var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function (err, db) {
    if (err) { throw err; }
    client.on('connection', function (socket) {
        console.log('Someone connected!');
        //messages is table or collection name not a database
        var col = db.collection('messages'),
            sendStatus = function (s) {
                socket.emit('status', s);
            };
        //Emit all messages
        col.find().limit(50).sort({ _id: 1 }).toArray(function (err, res) {
            if (err) { sendStatus('Error fetching messages.'); }

            socket.emit('output', res);
        });

        //wait for input
        socket.on('input', function (data) {
            // console.log(data)
            var name = data.name,
                message = data.message;
            whitespacePattern = /^\s*$/;

            if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
                //Cannot insert empty string.
                sendStatus('Name and Message is required!');

            } else {
                col.insert({ name: name, message: message }, function () {
                    //emit later message to all clients
                    client.emit('output',[data]);
                    sendStatus({
                        message: "Message sent",
                        clear: true
                    });
                });

            }


        });

    });

});