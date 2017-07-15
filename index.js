

var session = require('cookie-session'); 
var bodyParser = require('body-parser'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var fs = require('fs');


var promise = require('bluebird');
var options = {  promiseLib: promise };
var pgp = require('pg-promise')(options);


/////////////

var pg = require("pg");
const connectionString = "postgres://iphioobnwfhxqh:71052f3a32f6d245594b6e8c134f56cf4952b0e2e6838c2a7108f806437ee3a3@ec2-23-21-220-48.compute-1.amazonaws.com:5432/d2mg8u31dr7ukf";



app.get('/getPerson', function(request, response) {
  getPerson(request, response);
});

function getPerson(request, response) {
  // First get the person's id
  var id = request.query.id;

  // TODO: It would be nice to check here for a valid id before continuing on...

  // use a helper function to query the DB, and provide a callback for when it's done
  getPersonFromDb(id, function(error, result) {
    // This is the callback function that will be called when the DB is done.
    // The job here is just to send it back.

    // Make sure we got a row with the person, then prepare JSON to send back
    if (error || result == null || result.length != 1) {
      response.status(500).json({success: false, data: error});
    } else {
      var person = result[0];
      response.status(200).json(result[0]);
    }
  });
}

function getPersonFromDb(id, callback) {
  console.log("Getting person from DB with id: " + id);

  var client = new pg.Client(connectionString);

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT id, first, last, birthdate FROM person WHERE id = $1::int";
    var params = [id];

    var query = client.query(sql, params, function(err, result) {
      // we are now done getting the data from the DB, disconnect the client
      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }

      console.log("Found result: " + JSON.stringify(result.rows));

      // call whatever function the person that called us wanted, giving it
      // the results that we have been compiling
      callback(null, result.rows);
    });
  });

} // end of getPersonFromDb

// const db = pgp('postgres://iphioobnwfhxqh:71052f3a32f6d245594b6e8c134f56cf4952b0e2e6838c2a7108f806437ee3a3@ec2-23-21-220-48.compute-1.amazonaws.com:5432/d2mg8u31dr7ukf');

// db.one('SELECT * FROM user_info')
//   .then(function (data) {
//     console.log('DATA:', data)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   });





// ==========

// var options = {  promiseLib: promise };
// var pgp = require('pg-promise')(options);
// var connectionString = 'postgres://iphioobnwfhxqh:71052f3a32f6d245594b6e8c134f56cf4952b0e2e6838c2a7108f806437ee3a3@ec2-23-21-220-48.compute-1.amazonaws.com:5432/d2mg8u31dr7ukf';
// var db = pgp(connectionString);

// module.exports = {
//   getAllTodo: getAllTodo,
//   getSingleTodo: getSingleTodo,
//   createTodo: createTodo,
//   updateTodo: updateTodo,
//   removeTodo: removeTodo
// };
//===========

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
  response.sendFile(__dirname + '/public/test.html');
});
app.get('/contact', function(request, response) {
  response.sendFile(__dirname + '/public/contact.html');
});

app.get('/version2', function(request, response) {
  response.sendFile(__dirname + '/public/version2.html');
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Ops! It is 500 status!');
});
app.use(function(req, res, next) {
  res.status(404).send('Sorry, no URL with this name!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});