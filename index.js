var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var crypto = require('crypto')
var algorithm = 'aes-256-ctr'
var app = express()

const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')

function load(req, res) {
	res.render('index.ejs')
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.get('/', load)
router.post('/encrypt', function(req, res, next) {
	var name = req.body.name
	var secrettext = req.body.secrettext
	var password = req.body.password

	var cipher = crypto.createCipher(algorithm, name + password)
	var crypted = cipher.update(secrettext,'utf8','hex')

	crypted += cipher.final('hex')

	res.render('encrypted.ejs', { crypted })
})

router.post('/decrypt', function(req, res, next) {
	var name = req.body.name
	var secrettext = req.body.secrettext
	var password = req.body.password

	var decipher = crypto.createDecipher(algorithm, name + password)
	var dec = decipher.update(secrettext,'hex','utf8')
	dec += decipher.final('utf8')

	res.render('decrypted.ejs', { dec })
})

app.use(router)

app.listen(PORT, function() {
	console.log('App listening on port ' + PORT)
})

module.exports = app