const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }
}, {
    collection: 'user'
})

const model = mongoose.model("UserSchema", UserSchema)

module.exports = model