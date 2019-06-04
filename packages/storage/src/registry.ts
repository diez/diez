import {mkdirp, pathExists, readJson, writeJson} from 'fs-extra';
import {homedir} from 'os';
import {join} from 'path';
import {DiezRegistryOptions} from './api';

const diezRootPath = join(homedir(), '.diez');
const registryPath = join(diezRootPath, 'registry.json');

const ensureDiezRoot = () => mkdirp(diezRootPath);

const getRegistry = async (): Promise<Partial<DiezRegistryOptions>> => {
  await ensureDiezRoot();
  if (!await pathExists(registryPath)) {
    await writeJson(registryPath, {});
  }

  return await readJson(registryPath, {throws: false}) || {};
};

const setRegistry = async (configuration: Partial<DiezRegistryOptions>) => {
  await ensureDiezRoot();
  return writeJson(registryPath, configuration, {spaces: 2});
};

/**
 * A registry implementation with private details and async static accessors for reading/writing configuration values.
 */
export class Registry {
  private configuration: Partial<DiezRegistryOptions> = {};
  private static instance?: Registry;

  private async flush () {
    setRegistry(this.configuration);
  }

  private get (key: keyof DiezRegistryOptions) {
    return this.configuration[key];
  }

  private async set (values: Partial<DiezRegistryOptions>) {
    Object.assign(this.configuration, values);
    await this.flush();
  }

  private async delete (key: keyof DiezRegistryOptions) {
    delete this.configuration[key];
    await this.flush();
  }

  private static async initialize () {
    if (!Registry.instance) {
      Registry.instance = new Registry();
      Registry.instance.configuration = await getRegistry();
    }
  }

  /**
   * Gets a configuration value by key.
   * @param key The Configuration key requested.
   */
  static async get<T = string> (key: keyof DiezRegistryOptions): Promise<T | undefined> {
    await this.initialize();
    return this.instance!.get(key) as T | undefined;
  }

  /**
   * Sets a configuration value by key.
   * @param key The Configuration key to set.
   * @param value The Configuration key-value.
   */
  static async set (values: Partial<DiezRegistryOptions>) {
    await this.initialize();
    await this.instance!.set(values);
  }

  /**
   * Deletes a configuration value by key.
   * @param key The Configuration key to delete.
   */
  static async delete (key: keyof DiezRegistryOptions) {
    await this.initialize();
    await this.instance!.delete(key);
  }

  /**
   * Resets the in-memory registry.
   */
  static reset () {
    this.instance = undefined;
  }
}
