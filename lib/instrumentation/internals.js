var from = Buffer.from;
Buffer.from = function () {
    console.log('Inturcepting , buffer called with: ',arguments);
    // var stack = new Error().stack;
    // console.log( stack );
    // do some side-effect of your own
    //return 1;
    return from.apply(this, arguments);
};