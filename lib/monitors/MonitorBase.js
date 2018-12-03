function MonitorBase()
{
    // 
}

MonitorBase.prototype.parseScore = function(score = 0)
{
    if (score >= 70) {
        return 'high';
    }
    if (score >= 40) {
        return 'med';
    }
    return 'low';
}

module.exports = new MonitorBase;