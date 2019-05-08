import {mockOsData} from '../utils';

const os = jest.requireActual('os');

export const platform = () => mockOsData.platform;

export const homedir = () => os.tmpdir();

export default os;
