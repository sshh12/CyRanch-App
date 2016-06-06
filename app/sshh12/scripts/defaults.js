function setDefault(key, initial){
  var value = localStorage.getItem(key);
  if(typeof value === 'undefined' || value == null){
    localStorage.setItem(key, initial);
  }
}

setDefault("ViewCyRanchNews", "true");
setDefault("ViewAppNews", "true");
setDefault("ViewCFISDNews", "false");

setDefault("username", "");
setDefault("password", "");
