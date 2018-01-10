const fs = require('fs');
const timeStamp = require('./public/js/time.js').timeStamp;
const http = require('http');
const handleData = require('./public/js/addComment.js').handleData;
const WebApp = require('./public/js/webapp');
let registered_users = [{userName:'raghu',name:'Raghunath'}];
let toS = o=>JSON.stringify(o,null,2);

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
};
let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
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

const respondWithStatus = function(req,res,contentType) {
  let path = getPath(req.url);
  debugger;
  console.log(contentType,'---', path);
  fs.readFile(path,(err,data)=>{
    res.setHeader('content-Type',contentType);
    res.statusCode = 200;
    res.write(data);
    res.end();
  });
  return;
};

let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/html/guestBook.html']) && !req.user) res.redirect('/html/login.html');
};

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedOutUserToLogin);

app.get('/',(req,res)=>{
  respondWithStatus(req,res,'text/html');
});
app.get('/css/Abeliophyllum.css',(req,res)=>{
  respondWithStatus(req,res,'text/css');
});
app.get('/css/Ageratum.css',(req,res)=>{
  respondWithStatus(req,res,'text/css');
});
app.get('/css/guestBook.css',(req,res)=>{
  respondWithStatus(req,res,'text/css');
});
app.get('/css/style.css',(req,res)=>{
  respondWithStatus(req,res,'text/css');
});
app.get('/docs/Abeliophyllum.pdf',(req,res)=>{
  respondWithStatus(req,res,'application/pdf');
});
app.get('/docs/Ageratum.pdf',(req,res)=>{
  respondWithStatus(req,res,'application/pdf');
});
app.get('/html/index.html',(req,res)=>{
  respondWithStatus(req,res,'text/html');
});
app.get('/html/guestBook.html',(req,res)=>{
  respondWithStatus(req,res,'text/html');
});
app.get('/html/Abeliophyllum.html',(req,res)=>{
  respondWithStatus(req,res,'text/html');
});
app.get('/html/Ageratum.html',(req,res)=>{
  respondWithStatus(req,res,'text/html');
});
app.get('/html/login.html',(req,res)=>{
  respondWithStatus(req,res,'text/html');
})
app.get('/images/animated-flower-image-0021.gif',(req,res)=>{
  respondWithStatus(req,res,'base64');
});
app.get('/images/favicon.ico',(req,res)=>{
  respondWithStatus(req,res,'base64');
});
app.get('/images/freshorigins.jpg',(req,res)=>{
  respondWithStatus(req,res,'base64');
});
app.get('/images/pbase-Abeliophyllum.jpg',(req,res)=>{
  respondWithStatus(req,res,'base64');
});
app.get('/images/pbase-agerantum.jpg',(req,res)=>{
  respondWithStatus(req,res,'base64');
});
app.get('/js/comments.js',(req,res)=>{
  respondWithStatus(req,res,'text/javascript');
});
app.get('/js/flashImage.js',(req,res)=>{
  respondWithStatus(req,res,'text/javascript');
});
app.get('/js/guestBook.js',(req,res)=>{
  respondWithStatus(req,res,'text/javascript');
});
app.post('/checkUser',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.redirect('/html/guestBook.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/html/guestBook.html');
});
app.get("/js/comment.js",(req,res)=>{
  respondWithStatus(req,res,'text/javascript');
});
app.post('/js/addComment.js',(req,res)=>{
  handleData(req,res);
  res.redirect('/html/guestBook.html');
});

const PORT = 8000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
