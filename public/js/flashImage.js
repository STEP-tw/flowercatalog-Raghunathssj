const hideImage = function(){
  document.getElementById("image").style['visibility'] = "hidden";
  setTimeout(showImage,1000);
};

const showImage = function(){
  document.getElementById("image").style['visibility'] = "visible";
};
