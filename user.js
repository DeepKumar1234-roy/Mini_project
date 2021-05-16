const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
    name: { type: String, required: true },
		number: { type: Number, required: true, unique: true },
		address: { type: String, required: true },
		dob: {type: String, required: true },
		male: { type: String },
		female: { type: String },
		others: { type: String },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true }
	},
	{ collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model
