var mongoose = require("mongoose");
var dbURL = 'mongodb://localhost/Loc8r';
require("./locations");

mongoose.connect(dbURL);

mongoose.connection.on('connected',function () {
    console.log("Mongoose is connected to " + dbURL);
});

mongoose.connection.on("error",function (err) {
   console.log("Mongoose connection error: "  + err);
});

mongoose.connection.on("disconnected",function () {
    console.log("Mongoose is disconnected from: " + dbURL);
});

var readLine = require("readline");
if (process.platform == 'win32') {
    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT",function () {
        process.emit("SIGINT");
    })
};

var gracefulShutdown = function(msg,callback) {
    mongoose.connection.close(function () {
        console.log("Mongoose disconnected through " + msg);
        callback();
    })
}

process.once("SIGUSR2", function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid,'SIGUSR2');
    });
});

process.on("SIGINT",function () {
    gracefulShutdown('app termination',function () {
        process.exit(0);
    });
});

process.on("SIGTERM",function () {
    gracefulShutdown('Herokuapp shutdown',function () {
        process.exit(0);
    });
});