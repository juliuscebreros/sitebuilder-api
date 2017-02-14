import * as AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

AWS.config.update( {
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
} );

const docClient = new AWS.DynamoDB.DocumentClient();

function populateTable( filename ) {
    // load file
    const {
        tableName,
        data
    } = JSON.parse( fs.readFileSync( filename, 'utf8' ) );

    // add file into table
    return Promise.all(
        data.map( ( item ) => {
            const param = {
                TableName: tableName,
                Item: item
            }
            console.log( 'Putting item', param );
            return docClient.put( param ).promise();
        })
    ).then( ( data ) => {
        console.log( data );
        return data;
    });

}

export {
    populateTable
}

export default function() {
    // load sample database

    return populateTable( path.join( __dirname, './data/users.json' ) )
        .then( ( data ) => {
            console.log( data );
            console.log("Populated. Table description JSON:", JSON.stringify(data, null, 2));
            return data
        })
        .catch( ( err ) => {
            console.error("Unable to populate table. Error JSON:", JSON.stringify(err, null, 2));
            throw new Error( err );
        });
}
