import nightwatch from 'nightwatch';

declare module 'nightwatch' {
  export interface Expect {
    count: this;
    equal(value: string|number): this;
    endWith(value: string): this;
    elements(value: string): this;
    element(property: string, using: LocateStrategy): this;
  }

  export interface ElementCommands {
    click(using: LocateStrategy, value: string, callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<{ ELEMENT: string }>) => void): this;
    getText(using: LocateStrategy, selector: string): Promise<{value: string}>;
    getText(selector: string): Promise<{value: string}>;
  }

  export interface WebDriverProtocolElements {
    element(using: LocateStrategy, value: string, callback?: (this: NightwatchAPI, result: NightwatchCallbackResult<{ ELEMENT: string }>) => void): this;
  }
}
