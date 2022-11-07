console.log("Hello via lscovert!");

const express = require("express")
const serverless = require("serverless-http")
const multer  = require('multer')
const upload = multer({ dest: './dist/txt_to_url/uploads/' })

const fs = require("fs");
//const formidableMiddleware = require('express-formidable');
const server_name = "https://lsconvert.netlify.app/"//require("./server_name")
var path = require('path');


const app = express()




const txt_to_url = express.Router()
txt_to_url.use(express.urlencoded())

app.use(express.urlencoded())





txt_to_url.post('/', upload.single("txt_file"), check_if_file_is_valid, function(req,res){
    
    res.redirect(server_name+"get_txt_url.html?url="+req.file.path.replace("dist/", "")+"&server_name="+server_name);

    
    
    //res.json(req.files)
});


function check_if_file_is_valid(req, res, next){
    //res.send(req.file)
    let length = req.file.originalname.length;
    let name = req.file.originalname;
    let size = req.file.size;
    if(name.charAt(length-1) == "t" && name.charAt(length-2) == "x" && name.charAt(length-3) == "t" && name.charAt(length-4) == "."){
	// is valid
	
    }else{
	fs.unlink(req.file.path, (err)=>{console.log(`txt_to_url : ${err}`)});
	res.sendStatus(501);
	return;
    }

    if(size > 200000){
	fs.unlink(req.file.path, (err)=>{console.log(`txt_to_url : ${err}`)});
	res.sendStatus(501);
	return;
    }
    
    fs.rename(req.file.path, req.file.path += ".txt", (err)=>{console.log(`txt_to_url : ${err}`)});
    
    console.log("text extention is valid")
    next()
}

txt_to_url.get("/", (req, res) => {
    
    res.send("hello tere")
})













test = express.Router()



test.get("/", (req, res)=>{
    res.send("hello");
})

//const txt_to_url = require("./txt_to_url")
app.use("/.netlify/functions/index", txt_to_url)





app.listen(9000)


module.exports.handler = serverless(app);
