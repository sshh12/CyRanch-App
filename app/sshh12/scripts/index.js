
function testConnection(){
  getFromAPI('ping').then(function(response){
    response.text().then(function(text){
        if(text == 'pong'){
          return true;
        } else {
          return false;
        }
    });
  });
}
