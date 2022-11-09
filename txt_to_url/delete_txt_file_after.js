const express = require('express')
const app = express()
require('dotenv').config()
const { Deta } = require("deta")
const deta = Deta(process.env.h4nnln);
const drive = deta.Drive("txt_to_url");
const multer  = require('multer')
const upload = multer({ dest: '/tmp' })



// get all files

async function list_all_files(){
    
    let result = await drive.list();
    console.log(result);
    let allFiles = result.names;
    //let last = allFiles.at(allFiles.length-1);
   // console.log("last = "+ allFiles)


    for(let i=0; i<allFiles.length-1; i++){
	console.log("for loop")
	let length = allFiles[i].length;
	if(allFiles[i].charAt(length-1) === "e" &&
	  allFiles[i].charAt(length-2) === "m" &&
	  allFiles[i].charAt(length-3) === "i" &&
	  allFiles[i].charAt(length-4) === "t" &&
	   allFiles[i].charAt(length-5) === ".")
	{
	    const name = allFiles[i];
	    const file = await drive.get(name);
	    const buffer = await file.arrayBuffer();
	    let time_string = Buffer.from(buffer).toString();

	    
	    let seconds = new Date().getTime() / 1000;
	    let time = parseInt(time_string)
	    let diffrence = seconds - time;
	    
	    console.log("secends - time = " + diffrence);

	    if(diffrence > 1296000){
		const deleted_txt_file = await drive.delete(name.replace(".time", ".txt"));
		const deleted_time_file = await drive.delete(name);
		
	    }
	    
	    console.log(time);
	    
	}
    }

}


list_all_files();
