require('dotenv').config();

const express = require('express');
const multer = require('multer');
const mongo = require('mongoose');
const File = require('./model/file');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({extended:true}));
const upload = multer({dest:"uploads"});

mongo.set("strictQuery", false);
mongo.connect(process.env.DATABASE_URL);

app.set('view engine','ejs');

app.get('/', (req, res) =>{
    res.render('index');
    
});

app.post('/uplode',upload.single("file"),async(req,res)=>{
    const fileData = {
        path:req.file.path,
        originalName:req.file.originalname,
    };
    if(req.body.password != null && req.body.password !== ""){
        fileData.password = await bcrypt.hash(req.body.password,10)
    }
    const file = await File.create(fileData);
    console.log(file);
    res.render("index",{fileLink:`${req.headers.origin}/file/${file.id}`});
});

app.route("/file/:id").get(handelDownload).post(handelDownload);

async function handelDownload(req,res){
    const file = await File.findById(req.params.id);
    if(file.password != null){
        if(req.body.password == null){
            res.render('password');
            return
        }
        if(await bcrypt.compare(req.body.password,file.password)){
            res.render('password',{error:true})
        }
    }
    file.downloadCount ++;
    await file.save();
    console.log(file.downloadCount);
    res.download(file.path,file.originalName);
}



app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});