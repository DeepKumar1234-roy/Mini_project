const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var session = require('express-session');
const fs = require('fs');

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#5452*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb://localhost:27017/login-app-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())


app.get('/api/login', function(req,res,next){
	fs.readFile(__dirname + '/login.html'),'utf-8', function(err,data){
			if(err){
				return console.log(err);
			}
			var username = req.body;
			res.send(username);
	}

})





app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				name: user.name,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})


app.post('/api/register', async (req, res) => {
	const { name, number, address, dob, male, female, others, username, password: plainTextPassword } = req.body

	if (!name || typeof name !== 'string') {
		return res.json({ status: 'error', error: 'Invalid Name' })
	}

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 2) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			name,
			number,
			address,
			dob,
			male,
			female,
			others,
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

app.listen(4999, () => {
	console.log('Server up at 4999')
})
