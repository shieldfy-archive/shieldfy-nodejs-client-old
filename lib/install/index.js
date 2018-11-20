var Installer = require('./Installer');

function Install(client)
{
    let _Installer = new Installer(client);
    _Installer.run();
    console.log('Install');
}

module.exports = Install;