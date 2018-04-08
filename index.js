var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
var mongodb = require("mongodb");
var _ = require('lodash');
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post("/SearchSurgery", function (req, res) {
    console.log(req.body);
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        db.collection("surgery").find().toArray(function (err, result) {
        })
    })
})
app.post("/getDoctor", function (req, res) {
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }



        db.collection("doctor").find().toArray(function (err, result) {
            var hospital = result;
            hospital = hospital.map(item => {
                return {
                    name: item["Doctors name"], value: item["Doctors name"]
                }
            })
            var hospital = _.uniqBy(hospital, 'name');
            res.send(hospital)
        });

    })

})

app.post("/getHospital", function (req, res) {
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        db.collection("surgery").find().toArray(function (err, result) {
            var hospital = result;

            hospital = hospital.map(item => {
                return {
                    name: item.HOSPITAL, value: item.HOSPITAL
                }
            })
            var hospital = _.uniqBy(hospital, 'name');
            res.send(hospital)
        });

    })

})
app.post("/getType", function (req, res) {
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        db.collection("surgery").find().toArray(function (err, result) {
            var hospital = result;

            hospital = hospital.map(item => {
                return {
                    name: item.TYPE, value: item.TYPE
                }
            })
            var hospital = _.uniqBy(hospital, 'name');
            res.send(hospital)
        });

    })

})

app.post("/getSurgery", function (req, res) {
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        db.collection("surgery").find().toArray(function (err, result) {
            var surgery = result, hospital = result, speciality = result;

            surgery = surgery.map(item => {
                return {
                    name: item.Operation, value: item.Operation
                }
            })
            var surgery = _.uniqBy(surgery, 'name');
            res.send(surgery)
        });

    })

})
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});
app.listen(process.env.PORT || 7000);
