
import reduce from 'lodash/reduce';

import VError from 'verror';

import * as util from 'util';

const CODES = {
    BadDigest: 400,
    BadMethod: 405,
    ConnectTimeout: 408,
    Internal: 500,
    InvalidArgument: 409,
    InvalidContent: 400,
    InvalidCredentials: 401,
    InvalidHeader: 400,
    InvalidVersion: 400,
    MissingParameter: 409,
    NotAuthorized: 403,
    PreconditionFailed: 412,
    RequestExpired: 400,
    RequestThrottled: 429,
    ResourceNotFound: 404,
    WrongAccept: 406
};

var restErrors = reduce( CODES, ( acc, statusCode, errorCode ) => {
    // Append Error to the end of the name
    // This becomes the end of the constructor
    const name = errorCode + 'Error';

    acc[ name ] = function() {
        VError.apply( this, arguments );
    }
    util.inherits( acc[ name ], VError );

    /**
     * assign non-standard display name property on the CONSTRUCTOR (not
     * prototype), which is supported by all VMs. useful for stack trace
     * output.
     * @type {String}
     */
    acc[ name ].displayName = name;

    /**
     * the name of the error, used in the stack trace output
     * @type {String}
     */
    acc[name].prototype.name = name;

    /**
     * assign a default status code based on core http module.
     * users can override this if they want to. HttpError constructor
     * will handle overriding at the instance level.
     * @type {Number}
     */
    acc[name].prototype.statusCode = statusCode;

    /**
     * the default rest code. i.e., a BadDigestError has a restCode of
     * 'BadDigest'.  it is basically the key for the lookup in the CODES
     * mapping at the top of the file.
     * @type {String}
     */
    acc[name].prototype.restCode = errorCode;


    return acc;
}, {} );

module.exports = restErrors;
