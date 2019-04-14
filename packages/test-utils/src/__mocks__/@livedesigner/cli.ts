import {mockExec} from '../../utils';

const cli = jest.requireActual('@livedesigner/cli');

/**
 * Replaces execAsync with a mock.
 */
cli.execAsync = mockExec;

export = cli;
