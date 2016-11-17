import express from 'express';
import fs from 'fs';
import proxy from 'http-proxy-middleware';

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = isProd ? '/tmp/nginx.socket' : 3001;

//Dev mode, this replaces the production nginx proxy
if(!isProd) {
  app.use('/proxy/gov/', proxy({
    target: 'http://congress.api.sunlightfoundation.com/',
    changeOrigin: true,
    pathRewrite: {
      '^/proxy/gov/' : '/'
    }
  }));
}

app.listen(port, () => {
  console.log(`Backend listening on ${port}`);

  //Let nginx buildpack know we're ready
  isProd && fs.closeSync(fs.openSync('/tmp/app-initialized', 'w'));
});
