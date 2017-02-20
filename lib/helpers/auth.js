
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

function run( evt ) {
    let userToken = null;
    if ( !evt.accessToken ) {
        return Promise.reject({
                status: 400,
                message: 'Missing Access Token'
            });
    }

    try {
        userToken = jwt.verify( evt.accessToken, process.env.JWT_SECRET );
    } catch( err ) {
        return Promise.reject({
            status: 401,
            message: 'Invalid or expired access token'
        });
    }

    // Check Expiration, If Any
    if ( userToken.exp && userToken.exp < moment().unix() ) {
      return Promise.reject({
          status: 401,
          message: 'Expired access token'
      });
    }

    // Check Issuer
    if ( userToken.iss !== issuer ) {
      return Promise.reject({
          status: 401,
          message: 'Invalid access token'
      });
    }

    console.log( 'User Token:', userToken );

    // call user db
    return db.getByKey( 'Users', { id: userToken.id } )
        .then( ( user ) => {
            if ( !user ) {
                throw new Error( {
                    status: 404,
                    message: 'User not found'
                });
            }

            evt.req = {
                datetime: moment().unix(),
                user: user
            };

            return evt;
        })
        .catch( ( err ) => {
            if ( cb ) {
                return cb( {
                    status: 404,
                    message: 'User not found'
                });
            }
            throw err;
        });
}

export {
    createToken,
    run
}
