console.log("Finding Keyword:");

var string = "This sentence contains the word China";
var keyword = "Kenya";

function findKeyword(){
  var n = string.search(keyword);
  if (n < 0){
    console.log("Not Here!")
  }else{
    console.log("Found!")
  }
}
findKeyword();