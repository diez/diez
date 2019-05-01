import {mockExec} from '../../utils';

const cli = jest.requireActual('@diez/cli-core');

/**
 * Replaces execAsync with a mock.
 */
cli.execAsync = mockExec;

export = cli;
