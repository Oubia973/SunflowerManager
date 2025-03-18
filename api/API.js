
require('dotenv').config();
const rfs = require("rotating-file-stream");
const path = require("path");
const logger = require("./logger.js");
//const rateLimit = require('express-rate-limit');
const morgan = require("morgan");
const express = require("express");
const https = require('https');
const helmet = require("helmet");
const started = Date.now();
//const fs = require("fs");
require("colors");
const axios = require('axios');

const API_URL = "https://sunflower.tchimbedata.com";
const WEB_PORT = 2003;

const app = express();

//console.clear();

var accessLogStream = rfs.createStream('access.log', {
  interval: "7d",
  size: '10M',
  path: path.join(__dirname, 'log')
})

var ipLogStream = rfs.createStream('ipaccess.log', {
  interval: "7d",
  size: '10M',
  path: path.join(__dirname, 'log')
});

app.use(helmet({
  frameguard: true,
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  xssFilter: true,
}));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan('combined', { stream: accessLogStream }));
}
app.disable('x-powered-by');

//certificats
app.use('/.well-known/acme-challenge', express.static(path.join(__dirname, 'public/.well-known/acme-challenge')));
const sslOptions = {
  //key: fs.readFileSync(`./cert/key.key`),
  //cert: fs.readFileSync(`./cert/cert.crt`),
};
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    //option pour ignorer les erreur de certificats (non conseillé)
    rejectUnauthorized: false
  })
});

app.use(express.json());

const handleRequest = async (req, res, endpoint, method) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
  const frmid = req.headers['frmid'];
  logger.init(`${method} ${endpoint} ${frmid} from ${ip}`);

  try {
    let response;
    if (method === 'GET') {
      response = await axiosInstance.get(`${API_URL}${endpoint}`, {
        headers: {
          ...req.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } else if (method === 'POST') {
      response = await axiosInstance.post(`${API_URL}${endpoint}`, req.body, {
        headers: {
          ...req.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      logger.error(statusCode, `${endpoint} ${frmid}`);
      res.status(statusCode).json({ error: `Erreur lors de la requête (${statusCode})` });
    } else {
      logger.error(error.stack, `${endpoint} ${frmid}`);
      res.status(500).json({ error: 'Erreur lors de la requête' });
    }
  }
};

const endpoints = [
  '/getfarm',
  '/getdatacrypto',
  '/settry',
  '/getfromtolvl',
  '/getfromtoexpand',
  '/getactivity',
  '/get50listing',
  '/getHT',
  '/getHN',
  '/getHO'
];

endpoints.forEach(endpoint => {
  app.get(endpoint, (req, res) => {
    handleRequest(req, res, endpoint, 'GET');
  });
  app.post(endpoint, (req, res) => {
    handleRequest(req, res, endpoint, 'POST');
  });
});

/* const limiter = rateLimit({
  windowMs: 4000,
  max: 100,
  message: "Too much requests, wait a few seconds."
});
app.use(limiter); */

app.use(express.static(path.join(__dirname, '../../frontend/build')));

app.get('*', (req, res) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
  logger.init("GET / from " + ip + " : " + req.url);
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

https.createServer(sslOptions, app).listen(443, () => {
  const totaltime = Date.now() - started;
  console.log(" ");
  logger.init("[WEB] Web server started on port 443 (HTTPS)");
  logger.init("[WEB] Web server started in " + totaltime + "ms");
  console.log(" ");
});

// Serveur HTTP pour redirection vers HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log('Serveur HTTP démarré sur le port 80 pour redirection vers HTTPS');
});

app.listen(WEB_PORT, () => {
  var totaltime = Date.now() - started;
  console.log(" ")
  logger.init("[WEB] Web server started on port " + WEB_PORT)
  logger.init("[WEB] Web server started in " + totaltime + "ms")
  console.log(" ")
});