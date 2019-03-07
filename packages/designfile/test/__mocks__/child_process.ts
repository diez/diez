const childProcess = jest.genMockFromModule('child_process');
import {mockCommandData, mockExecutedCommands} from '../mockUtils';

export const exec = (command: string, callback: (error?: Error, stdout?: string) => {}) => {
  if (mockCommandData.forceFail) {
    callback(new Error());
  } else {
    mockExecutedCommands.push(command);
    callback(undefined, mockCommandData.stdout);
  }
};

export default childProcess;
