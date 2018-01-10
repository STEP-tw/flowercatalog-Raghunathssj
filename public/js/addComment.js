const fs = require('fs');

const decodeData = function(data){
  let content = data.replace(/[+]/g,' ');
  return decodeURIComponent(content);
}


const storeData = function(data,date,res) {
  let name = decodeData(data.Name);
  let comment = decodeData(data.Comment);
  fs.readFile('./data/comments.json',(err,data)=>{
    let content = JSON.parse(data);
    content.unshift({
      "Date":date,
      "Name":name,
      "Comment":comment
    });
    content = JSON.stringify(content,null,2);
    fs.writeFile('./data/comments.json',content,()=>{});
    fs.writeFile('./public/js/comments.js',`var comments = ${content}`,()=>{});
  });
  return;
}

const handleData = function(req,res) {
  let date = new Date();
  date = date.toLocaleString();
  let content = req.body;
  storeData(content,date,res);
  return;
};

exports.handleData = handleData;
