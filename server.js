const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


// Database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, { useMongoClient: true });
let db = mongoose.connection;
db.once('open', () => {
    console.log('DB connected!');
});
db.on('error', err => {
    console.log('DB ERROR: ', err);
});


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 보안상의 이유로 서버는 기본적으로 같은 서버가 아닌 다른 곳에서 오는 요청들을
// 기본적으로 차단한다.
// 또한 클라이언트에서 오는 요청도 다른곳으로 간주한다.
// 하지만 API는 클라이언트를 위한 프로그램이므로 같은 서버가 아닌 
// 다른곳에서 오는 요청들을 허가해야하는데 
// 이것을 HTTP 접근제어 혹은 CORS(Cross-Origin resource sharing, 출처가 다른곳끼리 자원 공유)라고 한다.
// 1. Access-Control-Allow-Origin
//    요청이 허용되는 url을 route을 제외하고 적는다. 이외의 url로 부터 오는 요청은 거절된다
//    단 *는 모든 요청을 허가
// 2. Access-Control-Allow-Methods
//    요청이 허용되는 HTTP verb 목록을 적는다. 여기에 포함되지 않은 HTTP verb의 요청은 거절, *는 사용불가
// 3. Access-Control-Allow-Headers
//    요청이 허용되는 HTTP header 목록을 적는다. 여기에 포함되지 않은 HTTP header는 사용할 수 없다. *는 사용불가

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Contorl-Allow-Headers', 'content-type');
    next();
});


// API
app.use('/api/heroes', require('./api/heroes'));


// Server
const port = 3000;
app.listen(port, () => {
    console.log('listening on port: ' + port);
});