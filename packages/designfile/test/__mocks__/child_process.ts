const childProcess: any = jest.genMockFromModule('child_process');

let __forceFail = false;
export const __executedCommands: string[] = [];

export const __enableForceFail = () => {
  __forceFail = true;
};

export const __disableForceFail = () => {
  __forceFail = false;
};

childProcess.exec = (command: string, callback: (error?: Error) => {}) => {
  if (__forceFail) {
    callback(new Error());
  } else {
    __executedCommands.push(command);
    callback();
  }
};

export const exec = childProcess.exec;
export default childProcess;
