// connects to AWS dynamodb service
import * as AWS from 'aws-sdk';

if ( !process.env.PRODUCTION ) {
    AWS.config.update( {
        region: 'us-west-2',
        endpoint: 'http://localhost:8000'
    } );
}

const docClient = new AWS.DynamoDB.DocumentClient();

function insert( tableName, item ) {
    const param = {
        TableName: tableName,
        Item: item
    }

    return docClient.put( param ).promise();
}

function getByKey( tableName, key ) {
    const param = {
        TableName: tableName,
        Key: key
    }
    return docClient.get( param ).promise()
        .then( ( data ) => {
            return data.Item;
        } );
}

function query( tableName, query, index ) {
    let expressions = [];
    let attributes = {};
    let values = {};
    for( let key in query ) {
        // construct keycondition expression
        // #key0 = :key0 && #key1 = :key1
        expressions.push( `#${key} = :${key}` );

        // construct attributeNames
        // #key: "key"
        attributes[ `#${key}` ] = key;

        // construct attributeValues
        // #key: value
        values[ `:${key}` ] = query[ key ];
    }

    const param = {
        TableName : tableName,
        KeyConditionExpression: expressions.join( ' and ' ),
        ExpressionAttributeNames: attributes,
        ExpressionAttributeValues: values
    };

    if ( index ) {
        param.IndexName = index;
    }

    return docClient.query( param ).promise();
}

export {
    insert,
    getByKey,
    query
}
