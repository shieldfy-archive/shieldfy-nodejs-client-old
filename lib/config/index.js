function Config(opts) {
  this._defaults = {
    "appKey":"",
    "appSecret":"",
    "debug":false,
    "action":"block",
    "blockPage":null,
  };
  this.setConfig(opts);
}

Config.prototype.setConfig=function (opts) {

  if (process.env.appKey !== undefined && process.env.appSecret !== undefined) {

    var EnvOpts={
      'appKey':process.env.appKey,
      'appSecret':process.env.appSecret
    }

    Object.assign(this._defaults,EnvOpts);
  }

  Object.assign(this._defaults,opts);
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
