console.log('starting function')

import testhello from '../../../lib/testhello';

export default function(e, ctx, cb) {
  console.log('processing event: %j', e)
  testhello.test( e, ctx, cb );
}
