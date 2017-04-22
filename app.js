#!/usr/bin/env node

let http = require('http'),
    httpProxy = require('http-proxy'),
    program = require('commander'),
    fs = require('fs');

let version = require('./package.json').version;

var configData = fs.readFileSync('./config.json', 'utf-8');
let config = JSON.parse(configData.replace(/\/\/.*/, ""));

program
  .version(version)
  .parse(process.argv);

//Setup program vars and do sanity checks
let port = config.port || 9000;
let protocol = config.protocol || 'http';


// var localSite = protocol + '://' + hostName + '/';
var proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  // let outgoingHeader = proxyReq.getHeader('host');
  // for (let host in config.hosts) {
  //   if (config.hosts[host] == outgoingHeader) {
  //     proxyReq.setHeader('host', host + `:${ port }`);
  //   }
  // }
  // let hostMap = config.hosts[proxyReq.getHeader('host')];
  // if (hostMap != undefined) {
  //   proxyReq.setHeader('host', hostMap);
  // }
});

let server = http.createServer((req, res) => {
  let hostMap = config.hosts[req.headers.host.replace(/[0-9]/g, '').replace(/:([^:]*)$/,'$1')];
  if (hostMap != undefined) {
    req.headers.host = hostMap;
  }
  proxy.web(req, res, { target: `${ protocol }://localhost` });
}).listen(port, () => {
  console.log('Proxy server listening on port %d', port);
});