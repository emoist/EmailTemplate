/*jshint esversion: 6 */
const connect = require('connect')
const connectRoute = require('connect-route')
const serveStatic = require('serve-static')
const mjml = require('mjml')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('./config.json')
const path = require('path')
const app = connect()

const bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME || 'localhost',
    user     : process.env.RDS_USERNAME || 'root',
    password : process.env.RDS_PASSWORD || '',
    port     : process.env.RDS_PORT     || 3306,
    database : config.dbName
});

connection.connect(function(error) {
    if (error) {
        console.error('error connecting:' + error.stack);
        return;
    }
    
    /*
    var sql = 'CREATE TABLE IF NOT EXISTS `users` (' +
                'id int(11) NOT NULL AUTO_INCREMENT,' +
                'fName VARCHAR(255) NOT NULL, ' +
                'lName VARCHAR(255) NOT NULL, ' +
                'email VARCHAR(255) NOT NULL, ' +
                'password VARCHAR(255) NOT NULL, ' +
                'PRIMARY KEY (id));' +
                'CREATE TABLE IF NOT EXISTS `emails` (' +
                'id int(11) NOT NULL AUTO_INCREMENT,' +
                '`template` text NOT NULL,' +
                '`user_id` int(11) NOT NULL,' +
                '`is_template` tinyint(4) NOT NULL DEFAULT 0,' +
                '`thumb_url` varchar(255) DEFAULT NULL,' +
                'PRIMARY KEY (id));';
    connection.query(sql, function(error) {
        console.log(error)
    });
    */
    console.log('Connected as id:' + connection.threadId);
});

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

// Extract object from request data
const processPost = (request, response, callback) => {
    let queryData = "";
    if (typeof callback !== 'function') return null;

    if (request.method == 'POST') {
        request.on('data', function (data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {
                    'Content-Type': 'text/plain'
                }).end();
                request.connection.destroy();
            }
        });

        request.on('end', function () {
            callback(JSON.parse(queryData));
        });

    } else {
        response.writeHead(405, {
            'Content-Type': 'text/plain'
        });
        response.end();
    }
}

app.use(connectRoute(router => {
    // Email html content
    router.post('/compile', (req, res, next) => {
        processPost(req, res, function (email) {
            const responsiveHtml = mjml.mjml2html(email)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(responsiveHtml));
        });
    })

    // Login action
    router.post('/auth/login', (req, res, next) => {
        processPost(req, res, function (data) {
            connection.query('SELECT * FROM `users` WHERE `email` = "' + data.email + '"', function (error, results, fields) {
                if (results.length == 0) {
                    res.writeHead(401);
                    return res.end("The email or password don't match");
                }
                else {
                    var user = results[0];

                    bcrypt.compare(data.password, user.password, function(err, flag) {
                        if (flag) {
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            });
                            res.end(JSON.stringify({
                                id_token: createToken(user)
                            }));
                        }
                        else {
                            res.writeHead(401);
                            return res.end("The email or password don't match");
                        }
                    });
                }
            });
        })
    })

    // Register action
    router.post('/auth/register', (req, res, next) => {
        processPost(req, res, function (data) {
            connection.query('SELECT * FROM `users` WHERE `email` = "' + data.email + '"', function (error, results, fields) {
                if (results.length > 0) {
                    res.writeHead(401);
                    return res.end("A user with that email already exists");
                }
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(data.password, salt, function(err, hash) {
                        var sql = "INSERT INTO `users` (fName, lName, email, password) VALUES ('" + data.fName +"', '" + data.lName + "', '" + data.email + "', '" + 
                        hash + "')";
                        connection.query(sql, function(err, results, fields) {
                            data['id'] = results.insertId;
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            });
                            res.end(JSON.stringify({
                                id_token: createToken(data)
                            }));
                        })
                    });
                });
            });
        })
    })

    // Get all emails by userid
    router.get('/emails/non_templates', (req, res, next) => {
        connection.query('SELECT emails.*, users.lName, users.fName FROM `emails` LEFT JOIN users on emails.user_id = users.id WHERE emails.is_template=0 ORDER BY user_id', function (error, results, fields) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(results));
        });
    })

    // Get all emails by userid
    router.get('/emails/templates', (req, res, next) => {
        connection.query('SELECT emails.* FROM `emails` WHERE emails.is_template=1', function (error, results, fields) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(results));
        });
    })

    // Create email template
    router.post('/emails/create', (req, res, next) => {
        processPost(req, res, function (data) {
            var sql = 'INSERT INTO `emails` (template, user_id, object_email, cible, ref_traffic, desinscription) VALUES ("' + data.template + '", ' + data.user_id + ', "' + data.object_email + '", "' + data.cible + '", "' + data.ref_traffic + '", "' + data.desinscription + '")'
            connection.query(sql, function(err, results, fields) {
                if (err) {
                    res.writeHead(403);
                    res.end('Error!');
                }
                else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })

                    res.end(JSON.stringify(results))
                }
            })
        });
    })

    // Get email template
    router.post('/emails/:id', (req, res, next) => {
        processPost(req, res, function (data) {
            connection.query('SELECT * FROM `emails` WHERE `id` = ' + req.params.id, function (error, results, fields) {
                if (results.length > 0) {
                    var emailRow = results[0];
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(emailRow));
                }
                else {
                    res.writeHead(401);
                    res.end("Email template don't exists");
                }
            });
        })
    })

    // Update email template
    router.post('/emails/update', (req, res, next) => {
        processPost(req, res, function (data) {
            connection.query('UPDATE emails SET template="' + data.template + '", object_email="' + data.object_email +'", cible="' + data.cible +'", ref_traffic="' + data.ref_traffic +'", desinscription="' + data.desinscription +'" WHERE id=' + data.id)
            res.writeHead(200)
            res.end("Email template saved")
        })
    })
}))

let port = process.env.PORT || process.argv[2] || 9000;
let project = process.env.NODE_ENV == 'production' ? require('./app/config.js').buildFolder : './app';

app.use(serveStatic(path.join(__dirname, project))).listen(port, function () {
    console.log('Server running on port %s.', port);
});