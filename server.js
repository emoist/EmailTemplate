var express = require('express'),
bodyParser  = require('body-parser'),
mjml        = require('mjml'),
_           = require('lodash'),
jwt         = require('jsonwebtoken'),
bcrypt      = require('bcrypt'),
config      = require('./config.json'),
mysql       = require('mysql'),
async       = require('async'),
aws         = require('aws-sdk'),
multer      = require( 'multer' ),
multerS3    = require('multer-s3'),
path        = require('path'),
crypto      = require('crypto'),
saltRounds  = 10,
app         = express()

var bucket = process.env.S3_BUCKET || config.S3_BUCKET
var dns = process.env.DNS ? 'http://' + process.env.DNS : ''

/**
 * DB TABLES
 *  - USERS
 *      id: int, fName: varchar, lName: varchar, email: varchar, password: varchar, role: varchar
 *  - EMAILS
 *      id: int, template: text, user_id: int, is_thumbnail: tinyint, object_email: varchar, cible: varchar, ref_traffic: varchar, desinscription: varchar, dm: varchar, produit: varchar, commentaire: varchar
 *  - IMAGES
 *      id: int, name: varchar, original_name: varchar
 */

aws.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: process.env.AWS_DEFAULT_REGION || config.aws.region
})

var s3 = new aws.S3()

var storage = multerS3({
    s3: s3,
    bucket: bucket,
    key: function (req, file, cb) {
        var hash = crypto.createHmac('sha256', file.originalname)
                   .digest('hex')
        cb(null, 'uploads/' + hash + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })

var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME || 'localhost',
    user     : process.env.RDS_USERNAME || 'root',
    password : process.env.RDS_PASSWORD || '',
    port     : process.env.RDS_PORT     || 3306,
    database : process.env.RDS_DB_NAME  || config.dbName
})

connection.connect(function(error) {
    if (error) {
        console.error('error connecting:' + error.stack)
        return
    }
    console.log('Connected as id:' + connection.threadId)
})

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 })
}

app.use(express.static('app'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Email html content
app.post('/compile', (req, res, next) => {
    const responsiveHtml = mjml.mjml2html(JSON.parse(req.body.data))
    res.writeHead(200, {
        'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(responsiveHtml))
})

// Login action
app.post('/auth/login', (req, res, next) => {
    var data = req.body
    connection.query('SELECT * FROM `users` WHERE `email` = "' + data.email + '"', function (error, results, fields) {
        if (results.length == 0) {
            res.writeHead(401)
            return res.end("The email or password don't match")
        }
        else {
            var user = results[0]

            bcrypt.compare(data.password, user.password, function(err, flag) {
                if (flag) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    res.end(JSON.stringify({
                        id_token: createToken(user)
                    }))
                }
                else {
                    res.writeHead(401)
                    return res.end("The email or password don't match")
                }
            })
        }
    })
})

// Register action
app.post('/auth/register', (req, res, next) => {
    var data = req.body
    connection.query('SELECT * FROM `users` WHERE `email` = "' + data.email + '"', function (error, results, fields) {
        if (results.length > 0) {
            res.writeHead(401)
            return res.end("A user with that email already exists")
        }
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(data.password, salt, function(err, hash) {
                var sql = "INSERT INTO `users` (fName, lName, email, password, role) VALUES ('" + data.fName +"', '" + data.lName + "', '" + data.email + "', '" + 
                hash + "', '" + data.role + "')"
                connection.query(sql, function(err, results, fields) {
                    data['id'] = results.insertId
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    res.end(JSON.stringify({
                        id_token: createToken(data)
                    }))
                })
            })
        })
    })
})

// Get all emails by userid
app.get('/emails/non_templates', (req, res, next) => {
    connection.query('SELECT emails.*, users.lName, users.fName FROM `emails` LEFT JOIN users on emails.user_id = users.id WHERE emails.is_template=0 ORDER BY user_id', function (error, results, fields) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(results))
    })
})

// Get all emails by userid
app.get('/emails/templates', (req, res, next) => {
    connection.query('SELECT emails.* FROM `emails` WHERE emails.is_template=1', function (error, results, fields) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(results))
    })
})

// Create email template
app.post('/emails/create', (req, res, next) => {
    var data = req.body
    var sql = 'INSERT INTO `emails` (template, user_id, object_email, cible, ref_traffic, desinscription, dm, produit, commentaire) VALUES ("' + data.template + '", ' + data.user_id + ', "' + data.object_email + '", "' + data.cible + '", "' + data.ref_traffic + '", "' + data.desinscription + '", "' + data.dm + '", "' + data.produit + '", "' + data.commentaire + '")'
    connection.query(sql, function(err, results, fields) {
        if (err) {
            res.writeHead(403)
            res.end('Error!')
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })

            res.end(JSON.stringify(results))
        }
    })
})

// Update email template
app.post('/emails/update', (req, res, next) => {
    var data = req.body
    connection.query('UPDATE emails SET template="' + data.template + '", object_email="' + data.object_email +'", cible="' + data.cible +'", ref_traffic="' + data.ref_traffic +'", desinscription="' + data.desinscription +'", dm="' + data.dm +'", produit="' + data.produit +'", commentaire="' + data.commentaire +'" WHERE id=' + data.id)
    res.writeHead(200)
    res.end("Email template saved")
})

// Get email template
app.get('/emails/:id', (req, res, next) => {
    connection.query('SELECT * FROM `emails` WHERE `id` = ' + req.params.id, function (error, results, fields) {
        if (results.length > 0) {
            var emailRow = results[0]
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            res.end(JSON.stringify(emailRow))
        }
        else {
            res.writeHead(401)
            res.end("Email template don't exists")
        }
    })
})

// Upload Image
app.post('/upload', upload.single('photo'), function(req, res, next) {
    if ( !req.file.mimetype.startsWith( 'image/' ) ) {
        return res.status( 422 ).json( {
            error : 'The uploaded file must be an image'
        } )
    }

    var sql = 'INSERT INTO `images` (name, original_name) VALUES ("' + req.file.key + '", "' + req.file.originalname + '")'
    connection.query(sql, function(err, results, fields) {
        if (err) {
            res.writeHead(403)
            res.end('Error!')
        }
        else {
            sql = 'SELECT images.* FROM `images` WHERE images.id=' + results.insertId
            connection.query(sql, function(err, images, fields) {
                var image = images[0]
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify(image))
            })
        }
    })
})

// Get galleries
app.get('/galleries', function(req, res, next) {
    connection.query('SELECT images.* FROM `images` ORDER BY id DESC', function (error, results, fields) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(results))
    })
})

// Remove gallery
app.delete('/galleries/:id', function(req, res, next) {
    var sql = "DELETE FROM `images` WHERE images.id=" + req.params.id
    connection.query(sql, function(error, results, fields) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(req.params.id))
    })
});

// Export html
app.post('/export_html', function(req, res, next) {
    var zipdir = require('zip-dir');
    var fs = require("fs-extra");
    var http = require('http');

    var date = new Date();
    var ref_traffic = req.body.folder;
    var subject = ref_traffic + ' ' + date.toUTCString();
    var dir = 'exports' + ref_traffic + date.getTime();
    var content = req.body.content;
    fs.mkdirSync(dir);

    async.parallel([
        function(callback) {
            var assets_dir = path.join(dir, 'assets', 'imgs');
            fs.copy('app/assets/imgs', assets_dir, function(err) {
                if (err){
                    console.log('An error occured while copying the folder.')
                    return console.error(err)
                }
                callback()
            })
        },
        function(callback) {
            var substrings = content.split("uploads/");
            var position = 0;
            var files = [];
            for (var i = 1; i < substrings.length; i++) {
                position = substrings[i].search('"');
                files.push("uploads/" + substrings[i].substring(0, position));
            }

            async.map(files, function(file, callback) {
                var params = {Bucket: bucket, Key: file}
                s3.getObject(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else {
                        fs.exists(dir + '/uploads', (exists) => {
                            if (exists) {
                                fs.writeFile(dir + '/' + file, data.Body, {encoding: null}, function(fserr){
                                    if(fserr){
                                        //if there is problem just print to console and move on.
                                        callback(fserr);
                                        return;
                                    }
                                    callback();
                                });
                            }
                            else {
                                fs.mkdirSync(dir + '/uploads');
                                fs.writeFile(dir + '/' + file, data.Body, {encoding: null}, function(fserr){
                                    if(fserr){
                                        //if there is problem just print to console and move on.
                                        callback(fserr);
                                        return;
                                    }
                                    callback();
                                });
                            }
                        })
                    }
                });
            }, function(err, results) {
                callback()
            })
        },
        function(callback) {
            var html_path = path.join(dir, dir + '.html')
            content = content.replace("uploads/", dns + "/uploads/")
            content = content.replace("assets/", dns + "/assets/")
            fs.writeFile(html_path, content, function(err, data) {
                callback()
            });
        },
        function(callback) {
            zipdir(dir, function (err, buffer) {
                s3.putObject({
                    Bucket: bucket,
                    Key: 'uploads/' + dir + '.zip',
                    Body: buffer,
                    ACL: 'public-read'
                  },function (resp) {
                    callback()
                });
            });
        },
        function(callback) {
            var aws_ses = require('aws-sdk');

            aws_ses.config.update({
                accessKeyId: config.ses.accessKeyId,
                secretAccessKey: config.ses.secretAccessKey,
                region: config.ses.region
            })

            var ses = new aws_ses.SES()
            
            const params = {
                Destination: {
                  ToAddresses: ['dddintftec.runme@previews.emailonacid.com']
                },
                Message: {
                  Body: {
                    Html: {
                      Charset: 'UTF-8',
                      Data: content
                    }
                  },
                  Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                  }
                },
                ReturnPath: 'noreply@probtp.digital',
                Source: 'noreply@probtp.digital'
            }
              
            ses.sendEmail(params, (err, data) => {
                if (err) console.log(err, err.stack)
                else console.log(data)
                callback()
            })
        }
    ], function(err, resutls) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(dir));
    })
});

app.get('/download/:folder', function(req, res) {
    var fs = require("fs-extra");
    res.download(path.join(req.params.folder, req.params.folder + '.html'), function() {
        fs.remove(req.params.folder);
    });
});

app.set('port', process.env.PORT || 9000)
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
})