const childProcess: any = jest.genMockFromModule('child_process');

let __forceFail = false;
let __stdout = '';
export const __executedCommands: string[] = [];

export const __enableForceFail = () => {
  __forceFail = true;
};

export const __disableForceFail = () => {
  __forceFail = false;
};

export const __setStdout = (stdout: string) => {
  __stdout = stdout;
};

childProcess.exec = (command: string, callback: (error?: Error, stdout?: string) => {}) => {
  if (__forceFail) {
    callback(new Error());
  } else {
    __executedCommands.push(command);
    callback(undefined, __stdout);
  }
};

export const exec = childProcess.exec;
export default childProcess;
