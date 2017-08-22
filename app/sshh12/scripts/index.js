
function testConnection(callback){

  getFromAPI('ping').then(function(response){

    response.text().then(function(text){
        if(text == 'pong'){
          callback(true);
        } else {
          callback(false);
        }
    });

  });

}

function signinToWifi(callback){ //TODO

    var data = {
      'username': localStorage.getItem("username"),
      'password': localStorage.getItem("password")
    }

    fetch("https://url/to/login", { method: "POST", body: data }).then(function(response){
      response.text().then(function(text){
        //if valid text -> callback(true)
      })
    })
}
