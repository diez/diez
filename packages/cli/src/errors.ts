import {makeTypedError} from 'typed-errors';

/**
 * A typed error for unauthorized requests.
 * @ignore
 */
export const UnauthorizedRequestException = makeTypedError('UnauthorizedRequestException');
