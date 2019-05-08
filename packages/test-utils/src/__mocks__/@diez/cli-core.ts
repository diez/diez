import {mockExec} from '../../utils';

const cli = jest.requireActual('@diez/cli-core');

/**
 * Replaces execAsync with a mock.
 */
cli.execAsync = mockExec;

cli.findOpenPort = () => Promise.resolve(9001);

export = cli;
