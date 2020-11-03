require('dotenv').config()
var express = require("express")
var cors = require('cors')
var app = express()
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",process.env.PORT))
});

app.use(
  cors({
    origin: process.env.AUTHORIZE_URL,
    optionsSuccessStatus: 200,
  })
);

var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var dbFile = './db/wooclap.db';
var dbExists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);

function createUsers() {
    db.run('create table if not exists `users` (' +
    '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    '`name` VARCHAR(255) NOT NULL,' +
    '`email_address` VARCHAR(255) NOT NULL);');
}
function createStats() {
    db.run('create table if not exists `stats` (' +
    '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    '`nb_collected_answers` INTEGER NOT NULL,' +
    '`nb_created_events` INTEGER NOT NULL,' +
    '`nb_created_questions` INTEGER NOT NULL,' +
    '`user_id` INTEGER REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE);');
}
function createUserHasAlreadySubmit() {
    db.run('create table if not exists `userHasAlreadySubmit` (' +
    '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
    '`name` VARCHAR(255) NOT NULL,' +
    '`organisation` VARCHAR(255) NOT NULL,' +
    '`job_title` VARCHAR(255) NOT NULL,' +
    '`email_address` VARCHAR(255) NOT NULL);');
}
function createOrganisations() {
    db.run('create table if not exists `organisations` (' +
    '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
    '`name` VARCHAR(255) NOT NULL,' +
    '`email_domain` VARCHAR(255) NOT NULL,' +
    '`is_client` INTEGER NOT NULL,' +
    'UNIQUE(`id`, `name`, `email_domain`));');
}
function addHarvard() {
    db.run('insert or ignore into `organisations` (`id`,`name`,`email_domain`,`is_client`) values (1,"Harvard University","harvard.edu",1);');
}
function addYale() {
    db.run('insert or ignore into `organisations` (`id`,`name`,`email_domain`,`is_client`) values (4,"Yale University","yale.edu",0);');
}
function addMit() {
    db.run('insert or ignore into `organisations` (`id`,`name`,`email_domain`,`is_client`) values (3,"MIT","mit.edu",0);');
}
function addStanford() {
    db.run('insert or ignore into `organisations` (`id`,`name`,`email_domain`,`is_client`) values (2,"Stanford University","stanford.edu",0);');
}
function addPrinceton() {
    db.run('insert or ignore into `organisations` (`id`,`name`,`email_domain`,`is_client`) values (5,"Princeton University","princeton.edu",0);');
}

if (!dbExists) {
    fs.openSync(dbFile, 'w');
    createUsers();
    setTimeout(createStats, 3000);
}

setTimeout(createUserHasAlreadySubmit, 3000);
setTimeout(createOrganisations, 3000);
setTimeout(addHarvard, 4000);
setTimeout(addStanford, 4000);
setTimeout(addMit, 4000);
setTimeout(addYale, 4000);
setTimeout(addPrinceton, 4000);

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.post("/api/submit-form", (req, res, next) => {
    var errors=[]
    if (!req.body.job_title){
        errors.push("No job_title specified");
    }
    if (!req.body.organisation){
        errors.push("No organisation specified");
    }
    if (!req.body.email_address){
        errors.push("No email_address specified");
    }
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (errors.length) {
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email_address: req.body.email_address,
        job_title: req.body.job_title,
        organisation: req.body.organisation
    }
    var sql ='INSERT INTO userHasAlreadySubmit (name, email_address, job_title, organisation) VALUES (?,?,?,?)'
    var params =[data.name, data.email_address, data.job_title, data.organisation]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
    console.log("POST /submit-form");
});

app.post("/api/send-custom-mail", (req, res, next) => {
    var errors=[]
    if (!req.body.organisation){
        errors.push("No organisation specified");
    }
    if (!req.body.concernedUsers){
        errors.push("No concernedUsers specified");
    }
    if (errors.length) {
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const organisation = req.body.organisation;
    const concernedUsers = req.body.concernedUsers;
    const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
    "Messages":[
        {
        "From": {
            "Email": process.env.WOOCLAP_BOT_EMAIL,
            "Name": process.env.WOOCLAP_BOT_NAME
        },
        "To": [
            {
            "Email": process.env.WOOCLAP_SALES_EMAIL,
            "Name": process.env.WOOCLAP_SALES_NAME
            }
        ],
        "Subject": "Potential Clients.",
        "TextPart": "Potential Clients.",
        "HTMLPart": `<h1>The organisation ${organisation} is interest in Wooclap</h1> <h2>Here are the users who asked for the white book</h2> <h3>${concernedUsers}<h3>`
        }
    ]
    })
    request
    .then((result) => {
        res.json({
            "message": "success",
            "email": result.body
        })
    })
    .catch((err) => {
        res.status(400).json({"error": err.message})
    })
    console.log("POST /send-custom-mail");
});

app.post("/api/send-mail", (req, res, next) => {
    var errors=[]
    if (!req.body.email_address){
        errors.push("No email_address specified");
    }
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (errors.length) {
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const name = req.body.name;
    const userEmail = req.body.email_address;
    const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
    "Messages":[
        {
        "From": {
            "Email": process.env.WOOCLAP_CONTACT_EMAIL,
            "Name": process.env.WOOCLAP_CONTACT_NAME
        },
        "To": [
            {
            "Email": userEmail,
            "Name": name
            }
        ],
        "Subject": "Our white paper.",
        "TextPart": "Our White Paper.",
        "HTMLPart": "<h3>Dear future customer, you can find our white paper at <a href='https://drive.google.com/uc?export=download&id=1lRy3jzjEUbSrrsksGGgjfAqIgkzyWre6'>this link</a>!</h3>",
        }
    ]
    })
    request
    .then((result) => {
        res.json({
            "message": "success",
            "email": result.body
        })
    })
    .catch((err) => {
        res.status(400).json({"error": err.message})
    })
    console.log("POST /send-mail");
});

app.get("/api/organisations", (req, res, next) => {
    var sql = "select * from organisations"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
      console.log("GET /organisations");
});

app.get("/api/users", (req, res, next) => {
    var sql = "select * from users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
      console.log("GET /users");
});

app.get("/api/user-has-already-submit", (req, res, next) => {
    var sql = "select * from userHasAlreadySubmit"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
      console.log("GET /userHasAlreadySubmit");
});

app.get("/api/stats", (req, res, next) => {
    var sql = "select * from stats"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
      console.log("GET /stats");
});

app.get("/api/stat/:id", (req, res, next) => {
    var sql = "select * from stats where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
      console.log(`GET /stat/${req.params.id}`);
});

app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.email_address){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email_address: req.body.email_address,
    }
    var sql ='INSERT INTO users (name, email_address) VALUES (?,?)'
    var params =[data.name, data.email_address]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
    console.log("POST /user");
})

app.patch("/api/organisation/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email_domain: req.body.email_domain,
        is_client: req.body.is_client
    }
    db.run(
        `UPDATE organisations set 
           name = COALESCE(?,name), 
           email_domain = COALESCE(?,email_domain),
           is_client = COALESCE(?,is_client)
           WHERE id = ?`,
        [data.name, data.email_domain, data.is_client, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
    console.log(`PATCH /organisation/${req.params.id}`);
})

app.use(function(req, res){
    res.status(404);
});