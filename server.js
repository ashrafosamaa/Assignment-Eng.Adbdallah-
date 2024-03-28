var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var storeRouter = require('./Router/storeRouter');
var bookRouter = require('./Router/bookRouter');
var userRouter = require('./Router/userRouter');
var loginRouter = require('./Router/loginRouter');
var uploadRouter = require('./Router/uploadRouter');
var exportRouter = require('./Router/exportRouter');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { Server } = require("socket.io");

var app = express();

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//*********************Socket.io ********************************************************

//Expose the node_modules folder as static resources
app.use('/static',express.static('node_modules'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


const server = app.listen(5000, () => {
  console.log('Server Start');
});
// initialize & listen to server
const io = new Server(server);
//Handle Connection
io.on('connection', function (socket) {
  console.log('Connection is successfully established to socket');

  setInterval(function () {
    var news = getNews();
     // Send news on the socket
      socket.emit('news', news);
  }, 5000);
  
  socket.on('any other event', (data) => {
    console.log(data);
  });
});


function getNews() {
  var length = Math.floor(Math.random() * 21);
  var news = [];
  for (var i = 0; i < length; i++){
    var val = { id: i, title: 'The Cure of Sadness is to play Videogames' + i, date: new Date() };
    news.push(val);
  }
  return news;
};

/////////////////////////////////////////////////////////////////////////////////////

// app.get('/', function (req, res) {
//   res.send('Server Started.......');
// });


app.use('/api/v1', storeRouter);
app.use('/api/v1', bookRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', loginRouter);
app.use('/api/v1', uploadRouter);
app.use('/api/v1', exportRouter);


// app.listen(5000, ()=> {
//   console.log('Server Start......');
// })

module.exports=app;