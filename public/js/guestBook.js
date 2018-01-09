const showComments = function(){
  comments.forEach(something);
}

const something = function(comment) {
  let keys = Object.keys(comment);
  let content = keys.map((ele)=>{
    return `${ele} : ${comment[ele]} <br>`;
  });
  content = content.join('\n');
  content += '<hr>';
  displayData(content);
};

const displayData = function(data) {
  let divElement = document.createElement('div');
  divElement.innerHTML = data;
  document.getElementById('comments').appendChild(divElement);
}

window.onload = showComments;
