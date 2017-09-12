var express = require('express');
var port = process.env.PORT || 4000;
var app = express();

app.set('view engine', 'pug');

app.use(express.static('./birth-mark.github.io'))
.listen(port, function() {

console.log('Example app listening on port ' + port);
});
