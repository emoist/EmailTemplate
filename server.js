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
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'emails'
});

connection.connect();

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

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
    router.post('/compile', (req, res, next) => {
        processPost(req, res, function (email) {
            const responsiveHtml = mjml.mjml2html(email)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(responsiveHtml));
        });
    })

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

    router.post('/emails', (req, res, next) => {
        processPost(req, res, function (data) {
            connection.query('SELECT * FROM `emails` WHERE `user_id` = ' + data.user_id, function (error, results, fields) {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(results));
            });
        });
    })

    router.post('/emails/create', (req, res, next) => {
        processPost(req, res, function (data) {
            var sql = 'INSERT INTO `emails` (template, user_id) VALUES ("' + data.template + '", ' + data.user_id + ')'
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

    router.post('/emails/:id', (req, res, next) => {
        processPost(req, res, function (data) {
            connection.query('SELECT * FROM `emails` WHERE `id` = ' + req.params.id, function (error, results, fields) {
                if (results.length > 0) {
                    var emailRow = results[0];
                    if (emailRow.user_id == data.user_id) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        res.end(JSON.stringify(emailRow.template));
                    }
                    else {
                        res.writeHead(403);
                        res.end("You can't access this email template");
                    }
                }
                else {
                    res.writeHead(401);
                    res.end("Email template don't exists");
                }
            });
        })
    })

    router.post('/emails/update', (req, res, next) => {
        processPost(req, res, function (data) {
            connection.query('UPDATE emails SET template="' + data.template + '" WHERE id=' + data.id)
        })
    })
}))

let port = process.env.PORT || process.argv[2] || 9000;
let project = process.env.NODE_ENV == 'production' ? require('./app/config.js').buildFolder : './app';

app.use(serveStatic(path.join(__dirname, project))).listen(port, function () {
    console.log('Server running on port %s.', port);
});