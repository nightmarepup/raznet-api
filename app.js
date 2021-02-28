const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


// loads the config files
const config = require("./config.json");
const dataconfig = require("./dbconfig.json");


//definds the infomation for the database
var dbConfig = {
    host: dataconfig.mysqlhost, // ip address of server running mysql
    user: dataconfig.mysqluser, // user name to your mysql database
    password: dataconfig.mysqlpass, // corresponding password
    database: dataconfig.mysqldata, // use the specified database
    port: dataconfig.mysqlport
};

var mysqlcon;
function handleDisconnect() {
    mysqlcon = mysql.createConnection(dbConfig);    // Recreate the connection, 
    mysqlcon.connect(function onConnect(err) {      // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    mysqlcon.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();



// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');


app.get('/' , function (req, res){

res.send('home')

})

app.get('/test' , function (req, res) {
    console.log('test')
    res.send('test')

});

//defines the port
app.listen(config.port, function (err) {
    if (err) {
        throw err
    }

    console.log(`Server started on port ${config.port}`)

});

