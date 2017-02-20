import {
    MissingParameterError,
    ResourceNotFoundError
} from '../helpers/error';

import * as uuid from 'node-uuid';

import * as db from '../helpers/db';

function register( e, ctx, cb ) {
    // e should username password combo
    const {
        username,
        password
    } = e;

    if ( !username ) {
        return cb( new MissingParameterError( 'Username is blank' ) );
    }

    if ( !password ) {
        return cb( new MissingParameterError( 'Password is blank' ) );
    }

    // write to database
    return db.query( 'Users', { username: username }, 'username' )
        .then( ( data ) => {
            // username should not exist
            if ( data.Items.length > 0 ) {
                throw new ResourceNotFoundError( 'Username is not available' );
            }

            // new user object
            const user = {
                id: uuid.v1(),
                username: username,
                password: password
            };

            return db.insert( 'Users', user )
                .then( () => {
                    return user;
                });
        })
        .then( ( user ) => {
            return cb( null, user );
        })
        .catch( ( err ) => {
            return cb( new ResourceNotFoundError( 'Username is not available' ) );
        });
}

function getById( e, ctx, cb ) {
    const {
        id
    } = e;

    if ( !id ) {
        return cb( new MissingParameterError( 'Id is blank' ) );
    }

    return db.getByKey( 'Users', { id: id } )
        .then( ( data ) => {
            if ( !data ) {
                throw new ResourceNotFoundError( 'User not found' );
            }

            return cb( null, data.Items[ 0 ] );
        })
        .catch( ( err ) => {
            return cb( err );
        })
}

function getByUsername( e, ctx, cb ) {
    const {
        username
    } = e;

    if ( !username ) {
        return cb( new MissingParameterError( 'Username is blank' ) );
    }

    return db.query( 'Users', { username: username }, 'username' )
        .then( ( data ) => {
            if ( data.Items.length == 0 ) {
                throw new ResourceNotFoundError( 'Username not found' );
            }

            return cb( null, data.Items[ 0 ] );
        })
        .catch( ( err ) => {
            return cb( err );
        });
}



export {
    register,
    getById,
    getByUsername
};
