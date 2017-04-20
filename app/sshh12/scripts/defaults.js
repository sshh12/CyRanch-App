function setDefault(key, initial) {
    var value = localStorage.getItem(key);
    if (typeof value === 'undefined' || value == null) {
        localStorage.setItem(key, initial);
    }
}

setDefault("newsoptions", JSON.stringify({
    'The Cy-Ranch App': '/icons/Developer.png',
    'Mustang News': '/icons/CyRanchMustangs.png'
}));

setDefault("lunch", "none");

setDefault("username", "");
setDefault("password", "");
setDefault("classwork", "");

setDefault("legal", "false");
