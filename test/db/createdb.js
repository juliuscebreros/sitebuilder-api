import AWS from 'aws-sdk';

import path from 'path';
import fs from 'fs';

AWS.config.update( {
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
} );

const dynamodb = new AWS.DynamoDB();

function createTable( params ) {
    return dynamodb.createTable( params ).promise();
}

export {
    createTable
}

export default function() {
    console.log( 'Creating tables ---' );

    const files = [
        path.join( __dirname, './schema/sites.json' ),
        path.join( __dirname, './schema/users.json' )
    ];

    return Promise.all(
        files.map( ( filename ) => {
            const schema = fs.readFileSync( filename, 'utf8' );
            console.log( schema );
            return createTable( JSON.parse( schema ) );
        })
    ).then( ( result ) => {
        return result;
    })
    .catch( ( err ) => {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        throw new Error( err );
    });
}
