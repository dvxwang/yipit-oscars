'use strict';
var chalk = require('chalk');
var express = require('express');
var app = express();
var path = require('path');

app.get('/calendar', function(req, res, next) {
	res.render('calendar');
});

app.get('/*', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../views/', 'index.html'));
});

var startServer = function () {
    var PORT = (process.env.PORT || 1234);

    app.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

startServer();
