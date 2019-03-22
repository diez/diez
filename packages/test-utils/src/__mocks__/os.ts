import {mockOsData} from '../utils';

const os = jest.genMockFromModule('os');

export const platform = () => mockOsData.platform;

export default os;
