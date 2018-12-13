function Debug(config)
{
    this.enable = config.debug;
    if (this.enable) {
        console.log('Run debug mode ...');
    }
}

Debug.prototype.set = function(...value)
{
    if (this.enable) {
        console.log('----------------------------- Shieldfy Debug -----------------------------');
        console.log('Shieldfy Time ' + this.getDateTime());
        if (value.length == 1) {
            console.log(value[0]);
        }
        if (value.length != 1) {
            for(var log in value) {
                console.log(value[log]);
            }
        }
        console.log('----------------------------- Shieldfy Debug -----------------------------');
    }
}

Debug.prototype.getDateTime = function() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

module.exports = Debug;