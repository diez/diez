import {existsSync, readFileSync} from 'fs';
import {dirname, join, resolve} from 'path';
import {Compiler, DefinePlugin} from 'webpack';

namespace DiezWebpackPlugin {
  /**
   * Options accepted by the plugin.
   */
  export interface Options {
    sdk: string;
    projectPath?: string;
  }
}

/**
 * Integrates a Diez project with Webpack.
 */
class DiezWebpackPlugin {
  constructor (private readonly options: DiezWebpackPlugin.Options) {
  }

  private validateOptions () {
    if (!this.options.sdk) {
      throw new Error('DiezWebpackPlugin: an `sdk` option is required.');
    }

    if (!this.options.projectPath) {
      let sdkPath;
      try {
        sdkPath = require.resolve(this.options.sdk);
      } catch (_) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`DiezWebpackPlugin: unable to resolve a Diez web SDK from the provided sdk option. Please ensure '${this.options.sdk}' is installed.`);
      }
      this.options.projectPath = resolve(dirname(sdkPath), '..', '..');
    }

    if (!existsSync(this.options.projectPath)) {
      // tslint:disable-next-line:max-line-length
      console.warn("DiezWebpackPlugin: unable to determine the location of your Diez project. Note that hot mode will not work unless you provide an explicit path via 'projectPath'.");
    }
  }

  private setAlias (compiler: Compiler) {
    if (this.options.projectPath) {
      const hotFilePath = join(this.options.projectPath, '.diez', 'web-hot-url');
      compiler.options.resolve = compiler.options.resolve || {};
      compiler.options.resolve.alias = compiler.options.resolve.alias || {};
      compiler.options.resolve.alias['@diez'] = existsSync(hotFilePath)
        ? join(this.options.projectPath, '.diez', 'web-assets')
        : join(this.options.projectPath, 'build', `${this.options.sdk}-web`, 'static');
    }
  }

  private setEnvironmentVariables (compiler: Compiler) {
    if (this.options.projectPath) {
      const hotFilePath = join(this.options.projectPath, '.diez', 'web-hot-url');
      if (existsSync(hotFilePath)) {
        const hotUrl = readFileSync(hotFilePath).toString().trim();
        console.warn(`Enabling hot mode with URL: ${hotUrl}`);
        compiler.options.plugins = compiler.options.plugins || [];
        compiler.options.plugins.push(
          new DefinePlugin({
            'process.env.DIEZ_IS_HOT': JSON.stringify(true),
            'process.env.DIEZ_SERVER_URL': JSON.stringify(hotUrl),
          }),
      );
      }
    }
  }

  apply (compiler: Compiler) {
    this.validateOptions();
    this.setAlias(compiler);
    this.setEnvironmentVariables(compiler);
  }
}

export = DiezWebpackPlugin;
