const mongo = require('mongoose');

const File = new mongo.Schema({
    path:{
        type:String,
        required:true
    },
    originalName:{
        type:String,
        required:true
    },
    password:String,
    downloadCount:{
        type:Number,
        required:true,
        default:0
    }
});

module.exports = mongo.model('File',File);