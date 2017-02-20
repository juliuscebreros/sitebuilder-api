
import * as user from '../lib/users';

import db from './db';

import should from 'should';

describe( 'User Find', ( ) => {
    
    before( ( done ) => {
        db( done );
    });


    it( 'should fail on blank username and password', ( done ) => {
        user.register( {
        }, null, ( err ) => {
            should.exist( err );
            return done();
        } );
    });

    it( 'should succeed on adding a new unique user', ( done ) => {
        user.register( {
            username: 'uniquename',
            password: '10101010'
        }, null, ( err, data ) => {
            should.not.exist( err );
            should.exist( data.id );
            should.exist( data.username );
            return done();
        })
    });

    it( 'should fail to add duplicate username', ( done ) => {
        user.register( {
            username: 'uniquename',
            password: 'doesntmatter'
        }, null, ( err, data ) => {
            should.exist( err );
            return done();
        });
    });
});
