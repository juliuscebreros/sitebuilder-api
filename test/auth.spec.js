import authInit from './auth';
import should from 'should';

import * as auth from '../lib/helpers/auth';
import sinon from 'sinon';

describe.only( 'Auth', () => {
    before( () => {
        authInit();
    });

    it( 'should fail on no accessToken', ( done ) => {
        const evt = {}
        auth.run( evt )
            .then( ( test ) => {
                console.log( 'Happened: ', test );
            })
            .catch(( err ) => {
                console.log( 'Error? ', err );
                should.exist( err );
                return done();
            });
    });

    it( 'should fail on expired access token', ( done ) => {
        // stub fake time
        const clock = sinon.useFakeTimers( new Date( 2011, 9, 11 ).getTime() );
        const evt = {
            accessToken: auth.createToken( { id: 'one', username: 'juliusone' } )
        };

        clock.tick( process.env.JWT_EXPIRY * 1000 );

        auth.run( evt )
            .catch( ( err ) => {
                clock.restore();
                should.exist( err );
                return done();
            });
    });

    it( 'should succeed on correct jwt token', ( done ) => {
        const evt = {
            accessToken: auth.createToken( { id: 'one', username: 'juliusone' } )
        };
        auth.run( evt )
            .then(( evt ) => {
                should.exist( evt.req );
                evt.req.user.id.should.equal( 'one' );
                evt.req.user.username.should.equal( 'juliusone' );
                return done();
            } )
            .catch( ( err ) => {
                return done( err );
            });
    });

    it( 'should fail on invalid user', ( done ) => {
        const evt = {
            accessToken: auth.createToken( { id: 'nooneishere', username: 'whatthehell' } )
        };
        auth.run( evt )
            .catch( ( err ) => {
                should.exist( err );
                return done();
            });
    });
});
