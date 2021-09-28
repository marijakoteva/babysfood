const proxy = require('express-http-proxy');
const express = require('express');
const cfg = require('../../pkg/config');
const path = require('path');

const app = express();

// app.use((req, res, next) => {
//   console.log(req.url);
//   console.log(req.path);
//   next();
// });

app.use('/api/v1/auth', proxy(
  'http://localhost:10001',
  // { proxyReqPathResolver: (req) => `http://localhost:10001/api/v1/auth${req.url === "/" ? '' : req.url}` }
  { proxyReqPathResolver: (req) => {
    console.log(req.url);
    return `http://localhost:10001/api/v1/auth${req.url}`;
  
  }}
));
app.use('/api/v1/recipe', proxy(
  'http://localhost:10002',
  { proxyReqPathResolver: (req) => `http://localhost:10002/api/v1/recipe${req.url}`}
));


app.use('/api/v1/storage', proxy(
  'http://localhost:10002',
  { proxyReqPathResolver: (req) => `http://localhost:10003/api/v1/storage${req.url}`}
));

// app.use('/api/v1/users', proxy(
//   'http://localhost:10003',
//   { proxyReqPathResolver: (req) => `http://localhost:10003/api/v1/users${req.url}`}
// ));

app.use('/', express.static(path.join(__dirname, '/../../public/build')));

const PORT = process.env.PORT || cfg.get('services').proxy.port;

app.listen(PORT, err => {
  if (err) {
    return console.error(err);
  }
  console.log(`Server started on port ${PORT}`);
});
