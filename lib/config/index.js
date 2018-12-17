function Config() {
  this._defaults = {
    "endPoint": 'http://localhost:3000/v2/',
    "appKey": null,
    "appSecret": null,
    "debug": false,
    "action": "block",
    "blockPage": null,
    "PingPongTime": 5       // Number of seconds
  };
}

Config.prototype.setConfig=function (opts) {

  if (process.env.appKey !== undefined && process.env.appSecret !== undefined) {

    var EnvOpts={
      'appKey':process.env.appKey,
      'appSecret':process.env.appSecret,
      'debug':process.env.debug
    }

    Object.assign(this._defaults,EnvOpts);
  }

  Object.assign(this._defaults,opts);
  return this._defaults;
}



//   if (process.env.SHIELDFY_APP_KEY !== undefined && process.env.SHIELDFY_APP_SECRET !== undefined) {
//
//     var opts={
//       'appKey':process.env.SHIELDFY_APP_KEY,
//       'appSecret':process.env.SHIELDFY_APP_SECRET
//     }
//
//     Object.assign(this._defaults,opts);
//
//   }else if (opts.SHIELDFY_APP_KEY !== undefined && opts.SHIELDFY_APP_SECRET !== undefined) {
//
//     Object.assign(this._defaults,opts);
//
//   }else {
//
//     return ;
//
//   }
// }



module.exports = Config;
