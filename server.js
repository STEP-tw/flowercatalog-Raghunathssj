const fs = require('fs');
const http = require('http');
const PORT = 8080;

const getContentType = function(extention) {
  let contentTypes = {
    'undefined': 'text/html',
    'html':'text/html',
    'jpg':'base64',
    'gif':'base64',
    'css':'text/css',
    'js':'text/javascript',
    'ico':'base64',
    'pdf':'application/pdf'
  }
  return contentTypes[extention];
};

const getPath = function(url) {
  let path;
  if(url == '/') {
    path = './public/html/index.html';
  }else {
    path = './public'+url;
  }
  return path;
};

const respondForFileNotFound = function(res,url){
  respond(res,'text/plain',`${url} Not Found`,404);
  return;
}

const respondWithStatus = function(res,req,contentType) {
  let path = getPath(req.url);
  fs.readFile(path,(err,data)=>{
    if (err)
      respondForFileNotFound(res,req.url)
    else
      respond(res,contentType,data,200);
  });
  return;
};

const respond = function(res,contentType,content,statusCode){
  res.setHeader('content-Type',contentType);
  res.statusCode = statusCode;
  res.write(content);
  res.end();
  return;
};

const decodeData = function(data,index){
  let seperatedData = data[index].split('=')[1];
  let decodeData = seperatedData.replace(/[+]/g,' ');
  return decodeURIComponent(decodeData);
}

const getGivenData = function(data){
  info = data.split('&');
  let name = decodeData(info,0);
let comment = decodeData(info,1);
  return {name:name,comment:comment};
}

const requestHandler = function(req,res) {
  console.log(`method : ${req.method} \nurl : ${req.url}`);
  let contentType = getContentType(req.url.split('.')[1]);
  if(req.url == '/addComment'){
    handleData(req,res,contentType);
    res.statusCode = 302;
    res.setHeader('location','/html/guestBook.html');
    res.end();
    return;
  }
  respondWithStatus(res,req,contentType);
};

const storeData = function(data,date,res) {
  let name = data.name;
  let comment = data.comment;
  fs.readFile('./comments.json',(err,data)=>{
    let content = JSON.parse(data);
    content.unshift({
      "date":date,
      "name":name,
      "comment":comment
    });
    content = JSON.stringify(content,null,2);
    fs.writeFile('./comments.json',content,()=>{});
    fs.writeFile('.publi/js/comments.js',`var comments = ${content}`,(err)=>{console.log(err)});
  });
  return;
}

const handleData = function(req,res) {
  req.on('data',(info)=>{
    let data = info.toString();
    let content = getGivenData(data);
    let date = new Date();
    date = date.toLocaleString();
    storeData(content,date,res);
    return;
  });
  return;
};

const server = http.createServer(requestHandler);

server.listen(PORT);
console.log(`listening at ${PORT}`);
