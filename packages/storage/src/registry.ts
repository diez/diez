import {existsSync, mkdirp, readJson, writeJson} from 'fs-extra';
import {homedir} from 'os';
import {join} from 'path';

/**
 * All the configuration values we can expect to find in the Registry.
 */
export interface Configuration {
  figmaAccessToken: string;
}

const diezRootPath = join(homedir(), '.diez');
const registryPath = join(diezRootPath, 'registry.json');

const ensureDiezRoot = () => mkdirp(diezRootPath);

const getRegistry = async (): Promise<Partial<Configuration>> => {
  await ensureDiezRoot();
  if (!existsSync(registryPath)) {
    await writeJson(registryPath, {});
  }

  return await readJson(registryPath);
};

const setRegistry = async (configuration: Partial<Configuration>) => {
  await ensureDiezRoot();
  await writeJson(registryPath, configuration);
};

/**
 * A registry implementation with private details and async static accessors for reading/writing configuration values.
 */
export class Registry {
  private configuration: Partial<Configuration> = {};
  private static instance?: Registry;

  private async flush () {
    setRegistry(this.configuration);
  }

  private get (key: keyof Configuration) {
    return this.configuration[key];
  }

  private async set (key: keyof Configuration, value: any) {
    this.configuration[key] = value;
    await this.flush();
  }

  private async delete (key: keyof Configuration) {
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
  static async get<T = string> (key: keyof Configuration): Promise<T | undefined> {
    await this.initialize();
    return this.instance!.get(key) as T | undefined;
  }

  /**
   * Sets a configuration value by key.
   * @param key The Configuration key to set.
   * @param value The Configuration key-value.
   */
  static async set (key: keyof Configuration, value: any) {
    await this.initialize();
    await this.instance!.set(key, value);
  }

  /**
   * Deletes a configuration value by key.
   * @param key The Configuration key to delete.
   */
  static async delete (key: keyof Configuration) {
    await this.initialize();
    await this.instance!.delete(key);
  }
}
