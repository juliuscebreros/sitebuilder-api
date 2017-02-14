const AWS = require( 'aws-sdk' );

const S3 = new AWS.S3();

module.exports = {
    test: ( e, ctx, cb ) => {
        console.log( 'This is a test' );
        S3.listBuckets( ( err, data ) => {
            if ( err ) {
                cb( err );
            }

            cb( null, data );
        });
    }
}
