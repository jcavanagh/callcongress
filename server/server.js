import express from 'express';
import fs from 'fs';

const app = express();

app.get('/api/test', function (req, res) {
  res.send('Hello World!')
})

app.listen('/tmp/nginx.socket', () => {
    console.log(`Backend listening on socket`);

    //Let Nginx know we're ready
    fs.closeSync(fs.openSync('/tmp/app-initialized', 'w'));
})