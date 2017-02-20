
import createdb, { createTable } from './createdb';
import deletedb, { deleteTable } from './deletedb';
import populatedb, { populateTable } from './populatedb';

export default function( cb ) {
    deletedb()
        .then( () => {
            return createdb();
        })
        .then( () => {
            return populatedb();
        })
        .then( () => {
            return cb();
        })
        .catch( ( err ) => {
            return cb( err );
        });
}
