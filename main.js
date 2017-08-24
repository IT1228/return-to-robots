const express = require("express");
const mustache = require('mustache-express');
// const dataJS = require('./data.js');
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017/robots';
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const application =  express();

application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use(bodyParser.urlencoded());
application.use("/public", express.static("./public"));

// application.get('/', function(request, response) {
//     response.render('index', dataJS)
// });

application.get('/', function(request,response){
    MongoClient.connect(url, async function(error, database){
        let robot = await database.collection('users').find({}).toArray();
            response.render('index', {users:robot} );
        })
    });

application.get('/users/:id', (request, response) => {
    MongoClient.connect(url, async (error, database) => {
        let robot = await database.collection('users').find({id: parseInt(request.params.id)}).toArray();
        response.render('detail', robot[0]);
    })
});

application.get('/unemployed', (request, response)=> {
    MongoClient.connect(url, async (error, database)=> {
        let robot = await database.collection('users').find( {job: null} ).toArray();
            response.render('index', {users: robot});
    })
});

application.get('/employed', (request, response) => {
    MongoClient.connect(url, async (error, database) => {
        let robot = await database.collection('users').find( {company: {$ne:null} } ).toArray();
            response.render('index', {users: robot });
    })
});


// application.get('/users/:id', function(request, response) {
//     console.log(request.params)
//     var parameterId = request.params.id;
//         var singleUser = dataJS.users.find(function(user){

//          if (user.id == parameterId) {

//             return true
//         } 
//       })
  
//    response.render('detail', singleUser);
//   });
application.listen(3000);