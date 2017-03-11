/**
 * Created by rofler on 8/31/16.
 */

var db_url = "http://94.63.5.193:5002/";

var wepPage_express = require("express");
var wepPage_app2 = wepPage_express();
var wepPage_router = wepPage_express.Router();
var wepPage_path = __dirname + '/html/';
wepPage_app2.use(wepPage_express.static(__dirname + '/html/'));
var wepPage_https = require('https');

wepPage_router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});

wepPage_router.get("/", function (req, res) {
    res.sendFile(wepPage_path + "index.html");
});

var proxy = require('http-proxy').createProxyServer({
    host: db_url,
    // port: 80
});
wepPage_router.use(
    [
        '/rest_server'
    ],
    function (req, res, next) {

        console.log(req.url);

        proxy.web(req, res, {
            target: db_url
        }, next);
    });

wepPage_app2.use("/", wepPage_router);

wepPage_app2.use(wepPage_express.static(__dirname));

wepPage_app2.use("*", function (req, res) {
    res.sendFile(wepPage_path + "404.html");
});


var webPage_server2 = wepPage_app2.listen(process.env.PORT || 4000, function () {

    var host = webPage_server2.address().address;
    var port = webPage_server2.address().port;

    console.log("Web page Live at http://%s:%s", host, port);
});
/*
var http = require("http");
setInterval(function() {
    console.log("doing my check");
    http.get("http://musicfrontend.herokuapp.com");
    http.get("http://musicbackend.herokuapp.com");
}, 300000); // every 5 minutes (300000)*/