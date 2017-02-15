import * as AWS from 'aws-sdk';

AWS.config.update( {
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
} );

const dynamodb = new AWS.DynamoDB();

function deleteTable( params ) {
    return dynamodb.deleteTable(params ).promise();
}

export {
    deleteTable
}

export default function( cb ) {
    console.log( 'Deleting tables---' );

    var tables = [
        'Users',
        'Sites'
    ];

    return Promise.all(
        tables.map( ( item ) => {
            var params = {
                TableName: item
            };
            return deleteTable( params )
                .catch( ( err ) => {
                    return {};
                });
        })
    ).then( ( data ) => {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        return data
    }).catch( ( err ) => {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        throw new Error( err );
    })
}
