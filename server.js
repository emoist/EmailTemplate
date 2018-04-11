var express = require('express'),
bodyParser  = require('body-parser'),
mjml        = require('mjml'),
_           = require('lodash'),
jwt         = require('jsonwebtoken'),
bcrypt      = require('bcrypt'),
config      = require('./config.json'),
mysql       = require('mysql'),
saltRounds  = 10,
app         = express(),
multer      =  require( 'multer' ),
upload      =  multer( { dest: 'app/uploads/' } )

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
    var sql = 'INSERT INTO `emails` (template, user_id, object_email, cible, ref_traffic, desinscription) VALUES ("' + data.template + '", ' + data.user_id + ', "' + data.object_email + '", "' + data.cible + '", "' + data.ref_traffic + '", "' + data.desinscription + '")'
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
    connection.query('UPDATE emails SET template="' + data.template + '", object_email="' + data.object_email +'", cible="' + data.cible +'", ref_traffic="' + data.ref_traffic +'", desinscription="' + data.desinscription +'" WHERE id=' + data.id)
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

    var sql = 'INSERT INTO `images` (name, original_name) VALUES ("' + req.file.filename + '", "' + req.file.originalname + '")'
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

app.set('port', process.env.PORT || 9000)
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
})