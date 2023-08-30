const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const BlogSchema = new mongoose.Schema({
    mainImage: { type: String },
    mainImageAltText: { type: String },
    mainHeading: { type: String},
    mainContent: { type: String },
    subSection: {type : Object},
    imgSection: {type : Object},
    imgAlignment : {type : String}
}, {
    collection: 'blog'
})



const model = mongoose.model("BlogSchema", BlogSchema)

module.exports = model