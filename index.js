var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
var mongodb = require("mongodb");
var fs = require('fs');
var request = require('request');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function diffTime() {
    var datenowstring = new Date().toISOString();
    var datenow = datenowstring.split('T')[0];
    var date = fs.readFileSync(__dirname + "/date.txt", "utf8");
    if (date) {
        var newddate = parseInt((new Date().getTime() / 1000).toFixed(0));
        var olddate = parseInt((new Date(date).getTime() / 1000).toFixed(0));
        var diffdate = newddate - olddate;
        if (diffdate > 86400) {

            return {
                status: false,
                date: datenow
            };
        }
        else {
            return {
                status: true,
                date: datenow
            };
        }
    }
    else {
        return {
            status: false,
            date: datenow
        };
    }

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
    mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
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
    let doctorname = body.doctor;
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
        Operation: surgicaltyp, TYPE: treatmentyp, HOSPITAL: hospitaltype, 'operation Options': operationopt, 'REMARKS': originaldescr,
        'Average  Length of  Stay': lengthofstays, 'Statistics': doctorname, 'Total  Charges': totalfees, 'Doctor\'s  Fees': doctorfees, 'Anaesthetist Fee': anaestheticfees, 'date': recentcases, website: 'wecarebill website', ward: privateornots
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
    mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
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
    mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
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
    mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
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
    mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
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
                return { "operation Options": item["operation Options"], "HOSPITAL": item["HOSPITAL"] }
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
    mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
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
    mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
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

app.post("/getDoctor", async function (req, res) {

    if (!diffTime().status) {
        mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
            var db = database;
            if (err) {
                console.log("srini222");
                console.log(err);
            }

            console.log("srini232");

            db.collection("doctor").find({}).toArray(function (err, result) {
                fs.writeFileSync(__dirname + "/date.txt", diffTime().date, "utf8");
                fs.writeFileSync(__dirname + "/doctor.json", JSON.stringify(result), "utf8");
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
    }
    else {

        await fs.readFile(__dirname + "/doctor.json", "utf8", function (err, data) {
            var result = JSON.parse(data);
            var hospital = result;
            hospital = hospital.map(item => {
                return item["Doctors name"]
            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
        });
    }
})

app.post("/getHospital", function (req, res) {
    if (!diffTime().status) {
        mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
            var db = database;
            if (err) {
                console.log(err);
            }
            db.collection("surgery").find().toArray(function (err, result) {
                fs.writeFileSync(__dirname + "/hospital.json", JSON.stringify(result), "utf8");
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
    }
    else {
        fs.readFile(__dirname + "/hospital.json", function (err, data) {
            var result = JSON.parse(data);
            var hospital = result;

            hospital = hospital.map(item => {
                return item.HOSPITAL

            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
        })
    }
})
app.post("/getType", function (req, res) {
    if (!diffTime().status) {
        mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
            var db = database;
            if (err) {
                console.log(err);
            }
            db.collection("surgery").find().toArray(function (err, result) {
                fs.writeFileSync(__dirname + "/type.json", JSON.stringify(result), "utf8");
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
    }
    else {
        fs.readFile(__dirname + "/type.json", function (err, data) {
            var result = JSON.parse(data);
            var hospital = result;
            hospital = hospital.map(item => {
                return item.TYPE

            })
            var destArray = _.uniq(hospital, function (x) {
                return x;
            });
            res.send(destArray)
        })
    }
})

app.post("/getSurgery", async function (req, res) {
    await request({
        url: 'http://medical-api.us-east-2.elasticbeanstalk.com/' + req.body.data.surgery,
        encoding: 'utf8'
    },
        function (error, response, body) {

            let bodyJ = JSON.parse(body);
            surgery = bodyJ.map((item, index) => {
                let itemstring = JSON.stringify(item);
                let itemvalue = _.uniq(item[Object.keys(item)]);
                return [Object.keys(item), itemvalue.toString()]
            })
            return res.send(surgery); // Print the HTML for the Google homepage.
        });


    // if (!diffTime().status) {
    //     mongodb.MongoClient.connect("mongodb://admin:srini@ec2-18-191-12-108.us-east-2.compute.amazonaws.com/admin", function (err, database) {
    //         var db = database;
    //         if (err) {
    //             console.log(err);
    //         }
    //         db.collection("surgery").find().toArray(function (err, result) {
    //             fs.writeFileSync(__dirname + "/surgery.json", JSON.stringify(result), "utf8");
    //             var surgery = result, hospital = result, speciality = result;

    //             surgery = surgery.map(item => {
    //                 return item.Operation
    //             })
    //             var destArray = _.uniq(surgery, function (x) {
    //                 return x;
    //             });
    //             res.send(destArray)
    //         });

    //     })
    // } else {
    //     fs.readFile(__dirname + "/surgery.json", function (err, data) {
    //         var result = JSON.parse(data);

    //         var surgery = result, hospital = result, speciality = result;

    //         surgery = surgery.map(item => {
    //             return item.Operation
    //         })
    //         var destArray = _.uniq(surgery, function (x) {
    //             return x;
    //         });
    //         res.send(destArray)
    //     })
    // }

})
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});
app.listen(process.env.PORT || 8000);
