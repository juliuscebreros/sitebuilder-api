import {
    MissingParameterError,
    ResourceNotFoundError
} from '../helpers/error';

import uuid from 'node-uuid';

import db from '../helpers/db';

function create( e, ctx, cb ) {
    // create a new page assigned to this user
}

function edit( e, ctx, cb ) {
    // edit a new page
}


function delete( e, ctx, cb ) {
}


export {
    create,
    edit,
    delete
}
