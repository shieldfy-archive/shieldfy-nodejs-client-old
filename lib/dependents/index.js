var ApiClient = require('../http/ApiClient');

function Dependents(client)
{

    this.api = new ApiClient(client);

}

Dependents.prototype.run = function(dependents)
{
    var dependents = JSON.parse(dependents);
    var outDependent = [];
    for (dependent in dependents) {
        var name = dependent.replace('@', '');
        var packageNameArr = name.split('/');
        
        if (packageNameArr.length == 1) {
            packageNameArr[1] = packageNameArr[0];
            packageNameArr[0] = '';
        }

        outDependent.push({
            vendor: packageNameArr[0],
            product: packageNameArr[1],
            language: 'nodejs',
            version: dependents[dependent].version
        });
    }
    this.send(outDependent);
}

Dependents.prototype.send = function(dependents)
{
    this.api.request('dependents', {
        data: JSON.stringify(dependents),
    });
}

module.exports = Dependents;