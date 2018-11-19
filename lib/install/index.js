var Installer = require('./Installer');

function Install(appKey, appSecret)
{
    let _Installer = new Installer(appKey, appSecret);
    _Installer.run();
    console.log('Install');
}

module.exports = Install;