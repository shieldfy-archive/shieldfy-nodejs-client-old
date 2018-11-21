var Config=require('../../config')
require('dotenv/config');




describe("config",function(){
    var opts={}
    var config=new Config()

    it(".setConfig return object",function(){
      expect(typeof(config.setConfig(opts))).toBe("object");
    })

    it(".appKey & .appSecret should be null by default",function(){
      var config=new Config()
        expect(config._defaults.appKey).toBe(null);
        expect(config._defaults.appSecret).toBe(null);
    })

    it(".appKey & .appSecret should return env variable",function(){
      config.setConfig(opts)
      expect(config._defaults.appKey).toBe(process.env.appKey);
      expect(config._defaults.appSecret).toBe(process.env.appSecret);
    })

    it(".appKey & .appSecret should not equal null when appkey & appSecret & debug exist",function(){
      var opts={
        appKey:'lajshdkjas',
        appSecret:'sdads',
        debug:true
      }
    config.setConfig(opts)
        expect(config._defaults.appKey).toBe(opts.appKey);
        expect(config._defaults.appSecret).toBe(opts.appSecret);
        expect(config._defaults.debug).toBe(true);
    })



})
