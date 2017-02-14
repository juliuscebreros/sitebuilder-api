console.log('starting function')

import user from '../../../lib/users';

export default function(e, ctx, cb) {
  console.log('processing event: %j', e)
  user.get( e, ctx, cb );
}
