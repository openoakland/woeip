const { spawn } = require('child_process');

const docker = spawn('docker', ['ps']);
// const docker = spawn('docker', ['compose', 'up', '-d', '--build']);
// const enterContainer = spawn('docker' ,['compose', 'exec', 'api', '/bin/bash'])

// docker.on('message', (msg) => {
//   console.log('Message from docker spawn---\n', msg);
// });

docker.stdout.on('data', (data) => {
    const apiContainerExists = /woaq-api/
    const stringify = data.toString()
    console.log('----->>>', stringify )
});

docker.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
});

docker.on('exit', function (code, signal) {
    console.log(`child process exited with code ${code} and signal ${signal}`);
    // if(code === 0 && signal === null){
        // }
});
