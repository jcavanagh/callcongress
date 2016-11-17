import express from 'express';
import fs from 'fs';
import proxy from 'http-proxy-middleware';
import twilio from 'twilio';

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

  app.use('/proxy/api/', proxy({
    target: 'http://localhost:3001/',
    changeOrigin: false,
    pathRewrite: {
      '^/proxy/api/' : '/api/'
    }
  }));
}

//Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/api/call', (req, resp) => {
  twilioClient.makeCall({
    to: process.env.TWILIO_TEST_NUMBER,
    from: process.env.TWILIO_NUMBER,
    url: `http://${req.headers.host}/api/call/outbound`
  }, (err, respData) => {
    if(err) {
      resp.send({
        message: err,
        response: respData
      });
    } else {
      resp.send({
        message: 'Call initiated',
        response: respData
      });
    }
  });
});

app.post('/api/call/outbound', (req, res) => {
  res.type('text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice">Hey neat, it works</Say><Dial>${process.env.TWILIO_TEST_NUMBER}</Dial></Response>`);
});

app.listen(port, () => {
  console.log(`Backend listening on ${port}`);

  //Let nginx buildpack know we're ready
  isProd && fs.closeSync(fs.openSync('/tmp/app-initialized', 'w'));
});
