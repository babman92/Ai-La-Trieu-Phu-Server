
var base64 = require('base-64');
var utf8 = require('utf8');
var AppUltis = require('./Ultis/appultis.js');
var appultis = new AppUltis();
//---------------right-------------------
var bytes = utf8.encode('Biển đông');
var encoded = base64.encode(bytes);
console.log(encoded);

//---------------fail---------------------
var encoded1 = appultis.encodeBase64FromUtf8("Biển đông");
console.log(encoded1);

