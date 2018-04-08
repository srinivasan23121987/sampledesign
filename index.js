var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
var mongodb = require("mongodb");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
var _ = require('lodash');
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.post("/SearchSurgeryR", function (req, res) {
    let body = req.body.data;
    let surgicaltyp = body.surgery;
    let treatmentyp = body.type;
    let hospitaltype = body.hospital;
    console.log(body);
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        filterarray = [{ $or: [{ "Operation": surgicaltyp.toLowerCase() }, { "Operation": surgicaltyp.toUpperCase() }, { "Operation": capitalizeFirstLetter(surgicaltyp) }, { "Operation": toTitleCase(surgicaltyp) }] },
        { $or: [{ "TYPE": treatmentyp.toLowerCase() }, { "TYPE": treatmentyp.toUpperCase() }, { "TYPE": capitalizeFirstLetter(treatmentyp) }, { "TYPE": toTitleCase(treatmentyp) }] },
        { $or: [{ "HOSPITAL": hospitaltype.toLowerCase() }, { "HOSPITAL": hospitaltype.toUpperCase() }, { "HOSPITAL": capitalizeFirstLetter(hospitaltype) }, { "HOSPITAL": toTitleCase(hospitaltype) }] }
        ]

        db.collection("surgery").find({
            $and: filterarray
        }).toArray(function (err, result) {
            var hospital = result;
            res.send(hospital)
        })
    })
})
app.post("/SearchSurgeryH", function (req, res) {
    let body = req.body.data;
    let surgicaltyp = body.surgery;
    let treatmentyp = body.type;
    console.log(body);
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        filterarray = [{ $or: [{ "Operation": surgicaltyp.toLowerCase() }, { "Operation": surgicaltyp.toUpperCase() }, { "Operation": capitalizeFirstLetter(surgicaltyp) }, { "Operation": toTitleCase(surgicaltyp) }] },
        { $or: [{ "TYPE": treatmentyp.toLowerCase() }, { "TYPE": treatmentyp.toUpperCase() }, { "TYPE": capitalizeFirstLetter(treatmentyp) }, { "TYPE": toTitleCase(treatmentyp) }] }
        ]

        db.collection("surgery").find({
            $and: filterarray
        }).toArray(function (err, result) {
            var hospital = result;
            hospital = hospital.map(item => {
                return {
                    name: item["HOSPITAL"], value: item["HOSPITAL"]
                }
            })
            var hospital = _.uniqBy(hospital, 'name');
            res.send(hospital)
        })
    })
})
app.post("/SearchSurgery", function (req, res) {
    let surgicaltyp = req.body.data;
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        filterarray = [{ $or: [{ "Operation": surgicaltyp.toLowerCase() }, { "Operation": surgicaltyp.toUpperCase() }, { "Operation": capitalizeFirstLetter(surgicaltyp) }, { "Operation": toTitleCase(surgicaltyp) }] }
        ]

        db.collection("surgery").find({
            $and: filterarray
        }).toArray(function (err, result) {
            var hospital = result;
            hospital = hospital.map(item => {
                return {
                    name: item["TYPE"], value: item["TYPE"]
                }
            })
            var hospital = _.uniqBy(hospital, 'name');
            res.send(hospital)
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
