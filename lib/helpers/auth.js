
import jwt from 'jsonwebtoken';
import * as db from './db';
import moment from 'moment';

const issuer = 'sitebuilder';

function createToken( user ) {
    const {
        username,
        id
    } = user;

    return jwt.sign(
        user,
        process.env.JWT_SECRET,
        {
            issuer: issuer,
            expiresIn: parseInt( process.env.JWT_EXPIRY )
        }
    );
}

function run( evt, cb ) {
    let userToken = null;
    if ( !evt.accessToken ) {
        return cb({
            status: 400,
            message: 'Missing Access Token'
        });
    }

    try {
        userToken = jwt.verify( evt.accessToken, process.env.JWT_SECRET );
    } catch( err ) {
        console.log( err );
        return cb({
            status: 401,
            message: 'Invalid or expired access token'
        });
    }

    // Check Expiration, If Any
    if ( userToken.exp && userToken.exp < moment().unix() ) {
      return callback({
          status: 401,
          message: 'Expired access token'
      }, null );
    }

    // Check Issuer
    if ( userToken.iss !== issuer ) {
      return callback({
          status: 401,
          message: 'Invalid access token'
      }, null );
    }

    console.log( 'User Token:', userToken );

    // call user db
    return db.getByKey( 'Users', { id: userToken.id } )
        .then( ( user ) => {
            evt.req = {
                datetime: moment().unix(),
                user: user
            };

            return cb( null, evt );
        })
        .catch( ( err ) => {
            return cb( {
                status: 404,
                message: 'User not found'
            });
        });
}

export {
    createToken,
    run
}
