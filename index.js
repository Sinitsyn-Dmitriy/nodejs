

var session = require('cookie-session'); 
var bodyParser = require('body-parser'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var fs = require('fs');



 //var pgp = require('pg-promise');
 //var db = pgp('postgres://iphioobnwfhxqh:71052f3a32f6d245594b6e8c134f56cf4952b0e2e6838c2a7108f806437ee3a3@ec2-23-21-220-48.compute-1.amazonaws.com:5432/d2mg8u31dr7ukf');

// db.one('SELECT $1 AS value', 123)
//   .then(function (data) {
//     console.log('DATA:', data.value)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   });

// db.one('SELECT $1 AS value', 123)
//   .then(function (data) {
//     console.log('DATA:', data.value)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   });

  
  

fs.readFile('test.txt', 'utf8', function(err, data) {  
    if (err) throw err;
    console.log(data);
});




app.get('/test.txt', function(request, response) {
  //response.send(cool());
  fs.readFile('test.txt', 'utf8', function(err, data) {  
    if (err) throw err;
    console.log(data);
    response.send(data);
});
});

app.use(express.static('public'));

// app.get('/style.css', function(request, response) {
//   response.send('style.css');
// });

// app.get('/style.css', function(request, response) {
//   //response.send(cool());
//   fs.readFile('/style.css', 'utf8', function(err, data) {  
//     if (err) throw err;
//     console.log(data);
//     response.send(data);
// });
// });


app.set('port', (process.env.PORT || 5123));

app.use(express.static(__dirname + '/public'));

app.use(session({secret: 'secret12345'}))

app.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})
app.get('/todo', function(req, res) { 
    res.render('todolist.ejs', {todolist: req.session.todolist});
})

app.post('/todo/addnew/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

app.get('/todo/deleteit/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/rate', function(request, response) {
  response.render('pages/rate')
});
app.get('/cool', function(request, response) {
  response.send(cool());
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});