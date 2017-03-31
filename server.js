var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err, db){
  if(err) {throw err;}
  client.on('connection', function(socket){
    console.log('Someone connected!');
    //messages is table or collection name not a database
    var col = db.collection('messages');
        socket.on('input', function(data){
           // console.log(data)
           var name = data.name,
               message = data.message;
                whitespacePattern = /^\s*$/;

      if(whitespacePattern.test(name) || whitespacePattern.test(message)){
          //Cannot insert empty string.
        console.log('Invalid!');
      } else {
            col.insert({name: name, message: message},function(){
                console.log('Inserted')
            });

      }


        });

    });

});