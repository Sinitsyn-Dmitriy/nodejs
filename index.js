

var session = require('cookie-session'); 
var bodyParser = require('body-parser'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var fs = require('fs');

/////////////
const pgp = require('pg-promise')();
const db = pgp('postgres://iphioobnwfhxqh:71052f3a32f6d245594b6e8c134f56cf4952b0e2e6838c2a7108f806437ee3a3@ec2-23-21-220-48.compute-1.amazonaws.com:5432/d2mg8u31dr7ukf');

db.one('SELECT * FROM user_info')
  .then(function (data) {
    console.log('DATA:', data)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });


var test123 = db.any('SELECT * FROM user_info');

// const query = db.query('SELECT * FROM user_info ORDER BY id ASC');
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });

// $usersSt = $db->prepare("SELECT * FROM user_info WHERE lastname = '". $pep ."'");  
// $usersSt->execute();
// $users = $usersSt->fetchAll(PDO::FETCH_ASSOC);


////////////

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

app.get('/about', function(request, response) {

  //response.sendFile(__dirname + '/test2.html');

  response.sendFile(__dirname + '/public/test.html');
});
app.get('/contact', function(request, response) {

  //response.sendFile(__dirname + '/test2.html');

  response.sendFile(__dirname + '/public/contact.html');
});

app.get('/version2', function(request, response) {

  //response.sendFile(__dirname + '/test2.html');

  response.sendFile(__dirname + '/public/version2.html');
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});