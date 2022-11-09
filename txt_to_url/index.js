// install express with `npm install express` 
const express = require('express')
const app = express()
require('dotenv').config()
const { Deta } = require("deta")
const deta = Deta(process.env.h4nnln);
const txt_to_url_drive = deta.Drive("txt_to_url");
const multer  = require('multer')
const upload = multer({ dest: '/tmp' })
const fs = require("fs");
var path = require('path');

const server_name = "https://lsconvert.netlify.app/"
const drive_name = "https://rplmkg.deta.dev/get_txt_to_url"

//const app = express()
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => res.send('GET OUT OF HERE!!!'))

app.get("/test", (req, res)=>{
    console.log("test")
    res.send("GET OUT OF HERE!!!")
})

app.post('/txt_to_url', upload.single("txt_file"),check_if_file_is_valid, async function(req,res){

    let seconds = new Date().getTime() / 1000;
    let seconds_string = seconds.toString();
    
    await txt_to_url_drive.put(req.file.filename+".txt", {path: req.file.path});

    await txt_to_url_drive.put(req.file.filename+".time", {data: seconds_string});

    res.redirect(server_name+"get_txt_url.html?url="+"?name="+req.file.path.replace("tmp/", "")+"&server_name="+drive_name);

    //res.send("test")
    
    res.send(req.file);
    
    //res.json(req.files)
});

app.get("/get_txt_to_url", async(req, res)=>{
    const name = req.query.name;
    const length = req.query.name.length
    if(name.charAt(length-1) == "t" && name.charAt(length-2) == "x" && name.charAt(length-3) == "t" && name.charAt(length-4) == "."){

	const buf = await txt_to_url_drive.get(req.query.name);
	
	res.set({"Content-Disposition":"attachment; filename=\""+req.query.name+"\""});
	
	
	const buffer = await buf.arrayBuffer();
	res.send(Buffer.from(buffer));
	
    }else{
	res.sendStatus(501);
    }

    
})

function check_if_file_is_valid(req, res, next){
    //res.send(req.file)
    let length = req.file.originalname.length;
    let name = req.file.originalname;
    let size = req.file.size;
    if(name.charAt(length-1) == "t" && name.charAt(length-2) == "x" && name.charAt(length-3) == "t" && name.charAt(length-4) == "."){
	// is valid
	
    }else{
	fs.unlink(req.file.path, (err)=>{if(err)console.log(`txt_to_url = ` + err.message)});
	res.sendStatus(501);
	return;
    }

    if(size > 500000){
	fs.unlink(req.file.path, (err)=>{if(err)console.log(`txt_to_url = ` + err.message)});
	res.sendStatus(501);
	return;
    }
    
    fs.rename(req.file.path, req.file.path += ".txt", (err)=>{if(err)console.log(`txt_to_url = ` + err.message)});
    
    console.log("text file is valid")
    next()
}


// export 'app'
module.exports = app
