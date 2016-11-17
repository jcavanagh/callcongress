import axios from 'axios';
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

app.post('/api/call', (req, res) => {
  if(req.query.phone && req.query.c_id) {
    twilioClient.makeCall({
      to: req.query.phone,
      from: process.env.TWILIO_NUMBER,
      url: `http://${req.headers.host}/api/call/outbound?c_id=${req.query.c_id}`
    }, (err, resData) => {
      if(err) {
        console.log(err, resData);
        res.send({message: err});
      } else {
        res.send({
          message: 'Call initiated'
        });
      }
    });
  } else {
    res.status(400).send({message: 'Please provide a phone number and congressperson ID' });
  }
});

//Gets a congressperson by bioguide_id
async function getCongressPerson(cid) {
  return await axios.get('http://congress.api.sunlightfoundation.com/legislators', { params: { bioguide_id: cid }}).then((resp) => {
    return resp.data.results[0];
  }).catch(e => console.error(e));
}

//Nicer sounding titles for robot voice
const TITLES = {
  Rep: 'Representative',
  Sen: 'Senator'
};

async function outboundHandler(req, res) {
  const cid = req.query.c_id;

  if(cid) {
    const person = await getCongressPerson(cid);

    if(person) {
      const title = TITLES[person.title] || '';
      const name = `${person.first_name} ${person.last_name}`;

      const twiml = new twilio.TwimlResponse();
      twiml.pause({ length: 1 });
      twiml.say(`Now connecting you to the office of ${title} ${name}`, {
        voice: 'alice'
      });
      twiml.dial(person.phone);

      res.type('text/xml');
      res.send(twiml.toString());
    }
  }

  res.status(400).send({ message: `Could not find congressperson with ID: ${cid}`});
}

app.post('/api/call/outbound', outboundHandler);
app.get('/api/call/outbound', outboundHandler);

app.listen(port, () => {
  console.log(`Backend listening on ${port}`);

  //Let nginx buildpack know we're ready
  isProd && fs.closeSync(fs.openSync('/tmp/app-initialized', 'w'));
});
