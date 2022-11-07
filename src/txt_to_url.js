

const txt_to_url = express.Router()
txt_to_url.use(express.urlencoded())

txt_to_url.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: './dist/txt_to_url',
    multiples: true, // req.files to be arrays of files
}));




txt_to_url.post('/', check_if_file_is_valid, function(req,res){

    res.redirect("/txt_to_url/get_txt_url?url="+req.files.txt_file.path.replace("dist/", "")+"&server_name="+server_name);

    
    
    //res.json(req.files)
});


txt_to_url.get('/get_txt_url', (req, res)=>{
    res.sendFile(path.resolve(__dirname + "/../dist/get_txt_url.html"), (err)=>{
	console.log(err)

	//res.sendStatus(404);
    })
})


function check_if_file_is_valid(req, res, next){

    let length = req.files.txt_file.name.length;
    let name = req.files.txt_file.name;
    let size = req.files.txt_file.size;
    if(name.charAt(length-1) == "t" && name.charAt(length-2) == "x" && name.charAt(length-3) == "t" && name.charAt(length-4) == "."){
	// is valid
	
    }else{
	fs.unlink(req.files.txt_file.path, (err)=>{console.log(`txt_to_url : ${err}`)});
	res.sendStatus(501);
	return;
    }

    if(size > 200000){
	fs.unlink(req.files.txt_file.path, (err)=>{console.log(`txt_to_url : ${err}`)});
	res.sendStatus(501);
	return;
    }
    
    fs.rename(req.files.txt_file.path, req.files.txt_file.path += ".txt", (err)=>{console.log(`txt_to_url : ${err}`)});
    
    console.log("text extention is valid")
    next()
}

txt_to_url.get("/", (req, res) => {
    
    res.send("hello tere")
})

















module.exports = txt_to_url
