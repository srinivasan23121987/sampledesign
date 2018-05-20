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
app.get('/treatment/:type', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.post('/treatment/:type', function (req, res) {
    let surgicaltyp = req.params.type;
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
                return item["TYPE"]
            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)

        })
    })

})
app.post("/SearchSurgerySubmitData", function (req, res) {
    let body = req.body.data;
    let surgicaltyp = body.surgery;
    let treatmentyp = body.type;
    let hospitaltype = body.hospital;
    let operationopt = body.operationopt;
    let percentile = body.percentile;
    let privateornots = body.privateornots;
    let recentcases = body.recentcases;
    let lengthofstays = body.lengthofstays;
    let totalfees = body.totalfees;
    let doctorfees = body.doctorfees;
    let originaldescr = body.originaldescr;
    let anaestheticfees = body.anaestheticfees;
    let myObj = {
        Operation: surgicaltyp, TYPE: treatmentyp, HOSPITAL: hospitaltype,ward:privateornots,website:'wecarebill website', 'operation Options': operationopt, 'Orignal description': originaldescr,
        'Average  Length of  Stay': lengthofstays, 'Statistics': percentile, 'Total  Charges': totalfees, 'Doctor\'s  Fees': doctorfees, 'Anaesthetist Fee': anaestheticfees, 'date': recentcases
    };
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds249025.mlab.com:49025/surgery", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }

        db.collection("surgery").insertOne(myObj, function (err, result) {
            var hospital = result;
            res.send(hospital)
        })
        
    })
})
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
                return item["HOSPITAL"]
            })

            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
        })
    })
})
app.post("/SearchSurgeryHDS", function (req, res) {
    let body = req.body.data;
    let surgicaltyp = body.surgery;
    let treatmentyp = body.type;
    let hospitaltype = body.hospital;
    let totalCost = body.percentile;
    console.log(body);
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        filterarray = [{ $or: [{ "Operation": surgicaltyp.toLowerCase() }, { "Operation": surgicaltyp.toUpperCase() }, { "Operation": capitalizeFirstLetter(surgicaltyp) }, { "Operation": toTitleCase(surgicaltyp) }] },
        { $or: [{ "TYPE": treatmentyp.toLowerCase() }, { "TYPE": treatmentyp.toUpperCase() }, { "TYPE": capitalizeFirstLetter(treatmentyp) }, { "TYPE": toTitleCase(treatmentyp) }] },
        { $or: [{ "HOSPITAL": hospitaltype.toLowerCase() }, { "HOSPITAL": hospitaltype.toUpperCase() }, { "HOSPITAL": capitalizeFirstLetter(hospitaltype) }, { "HOSPITAL": toTitleCase(hospitaltype) }] },
        { $or: [{ "Statistics": totalCost.toLowerCase() }, { "Statistics": totalCost.toUpperCase() }, { "Statistics": capitalizeFirstLetter(totalCost) }, { "Statistics": toTitleCase(totalCost) }] }
        ]

        db.collection("surgery").find({
            $and: filterarray
        }).toArray(function (err, result) {

            res.send(result)
        })
    })
})
app.post("/SearchSurgeryHD", function (req, res) {
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
                return {"operation Options":item["operation Options"],"HOSPITAL":item["HOSPITAL"]}
            })

            var destArray = _.uniqBy(hospital, function (x) {
                return x["operation Options"] && x["HOSPITAL"];
            });
            res.send(destArray)
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
                return item["TYPE"]
            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)

        })
    })
})
app.post("/SearchSurgerySpecDoctor", function (req, res) {
    mongodb.MongoClient.connect("mongodb://admin:admin123@ds149335.mlab.com:49335/hospital", function (err, database) {
        var db = database;
        if (err) {
            console.log(err);
        }
        let surgicaltyp = req.body.data.type;
        filterarray = [{ $or: [{ "Speciality": surgicaltyp.toLowerCase() }, { "Speciality": surgicaltyp.toUpperCase() }, { "Speciality": capitalizeFirstLetter(surgicaltyp) }, { "Speciality": toTitleCase(surgicaltyp) }] }]
        db.collection("doctor").find({
            $and: filterarray
        }).toArray(function (err, result) {
            var hospital = result;
            hospital = hospital.map(item => {
                return item["Doctors name"]
            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
        });

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
                return item["Doctors name"]
            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
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
                return item.HOSPITAL

            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
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
                return item.TYPE

            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
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
                return item.Operation
            })
            var destArray = _.uniq(surgery, function (x) {
                return x;
            });
            res.send(destArray)
        });

    })

})
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});
app.listen(process.env.PORT || 8000);
