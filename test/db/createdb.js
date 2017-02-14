import * as AWS from 'aws-sdk';

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
    // initialize
    let params = {
        TableName : "Users",

        KeySchema: [
            { AttributeName: "id", KeyType: "HASH"},  //Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "username", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'username',
                KeySchema: [{
                    AttributeName: 'username',
                    KeyType: 'HASH'
                }],
                Projection: {
                    ProjectionType: 'INCLUDE',
                    NonKeyAttributes: [ 'username' ]
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 10,
                    WriteCapacityUnits: 10
                }
            }
        ]
    };

    return createTable( params )
        .then( ( data ) => {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            return data;
        })
        .catch( ( err ) => {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            throw new Error( err );
        });
}
