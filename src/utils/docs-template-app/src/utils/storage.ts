/**
 * Perform feature detection & testing of localStorage
 */
const hasLocalStorageEnabled = () => {
  const diez = 'diez';
  try {
    localStorage.setItem(diez, diez);
    localStorage.removeItem(diez);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Wrapper class to all localStorage needs.
 */
class Storage {
  private fallbackStorage = new Map<string, string>();
  private localStorage = hasLocalStorageEnabled();

  set (key: string, value: string) {
    if (this.localStorage) {
      localStorage.setItem(key, value);
    }

    this.fallbackStorage.set(key, value);
  }

  get (key: string) {
    if (this.localStorage) {
      return localStorage.getItem(key);
    }

    return this.fallbackStorage.get(key);
  }

  clear () {
    if (this.localStorage) {
      localStorage.clear();
    }

    this.fallbackStorage.clear();
  }

  setJson (key: string, value: any) {
    this.set(key, JSON.stringify(value));
  }

  getJson<T = any> (key: string) {
    const rawValue = this.get(key);

    if (rawValue) {
      return JSON.parse(rawValue) as T;
    }

    return null;
  }
}

/**
 * Export a singleton instance to manage storage across the app.
 */
export const storage = new Storage();
