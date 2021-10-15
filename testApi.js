var shell = require('shelljs');

shell.exec('docker compose exec api /bin/bash', function(code, stdout, stderr) {
    console.log('Exit code:', code);
    console.log('Program output:', stdout);
    console.log('Program stderr:', stderr);
  });