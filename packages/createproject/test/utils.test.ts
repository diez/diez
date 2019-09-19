const mockedSpawnSync = jest.fn();
jest.doMock('child_process', () => ({
  ...jest.requireActual('child_process'),
  spawnSync: mockedSpawnSync,
}));

import {canUseNpm} from '../src/utils';

describe('canUseNpm', () => {
  mockedSpawnSync.mockReturnValue({
    output: [
      null,
      Buffer.alloc(539, `
; cli configs
metrics-registry = "https://registry.npmjs.org/"
scope = ""
user-agent = "npm/6.4.1 node/v10.16.3 darwin x64"

; userconfig /Users/jiggs/.npmrc
@haiku:registry = "https://reservoir.haiku.ai:8910/"

; node bin location = /Users/jiggs/.nvm/versions/node/v10.16.3/bin/node
; cwd = /Users/jiggs/projects/haiku/diez/packages/compiler-core
; HOME = /Users/jiggs
; "npm config ls -l" to show all defaults.
      `),
    ],
  });

  test('returns expected values', async () => {
    expect(await canUseNpm('/Users/jiraffe/projects/haiku/diez/packages/compiler-core')).toBe(false);
    expect(await canUseNpm('/Users/jiggs/projects/haiku/diez/packages/compiler-core')).toBe(true);
  });

  test('returns true if npm returns an invalid value', async () => {
    mockedSpawnSync.mockReturnValueOnce(null);
    expect(await canUseNpm('/does/not/matter')).toBe(true);
  });

  test('returns true if cant find npm cwd in npm output', async () => {
    mockedSpawnSync.mockReturnValue({
      output: [
        null,
        Buffer.alloc(0, ''),
      ],
    });

    expect(await canUseNpm('/does/not/matter')).toBe(true);
  });
});
