var Storage = require('./storage');

var storage = new Storage({
    option: 'default'
});

storage.set('name', 'karim');

console.log(storage.get('name'));