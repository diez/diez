import {mockCodegen, mockLocateFont} from '../../utils';

const generation = jest.requireActual('@diez/generation');

generation.codegenDesignSystem = mockCodegen;
generation.locateFont = mockLocateFont;

export = generation;
