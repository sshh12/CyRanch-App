function setDefault(key, initial){
  var value = localStorage.getItem(key);
  if(typeof value === 'undefined' || value == null){
    localStorage.setItem(key, initial);
  }
}

setDefault("ViewCyRanchNews", "true");
setDefault("ViewCyRanchNewsSports", "false");
setDefault("ViewCyRanchNewsEntertainment", "false");
setDefault("ViewCyRanchNewsStudentLife", "false");
setDefault("ViewCyRanchNewsOpinion", "false");

setDefault("ViewAppNews", "true");
setDefault("ViewCFISDNews", "false");

setDefault("username", "");
setDefault("password", "");
