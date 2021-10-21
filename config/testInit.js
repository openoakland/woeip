const { fork } = require('child_process');

const dockerSpawn = fork('./config/dockerTests.js');

dockerSpawn.on('message', (msg) => {
  console.log('Message from docker spawn---\n', msg);
});

dockerSpawn.send({ result: 'DONE...' })