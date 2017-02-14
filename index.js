console.log('starting function')

const testhello = require( '../../lib/testhello.js' );

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  testhello.test( cb );
}
