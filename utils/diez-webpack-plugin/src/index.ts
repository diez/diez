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
      console.warn('DiezWebpackPlugin: unable to determine the location of your Diez project. Note that hot mode will not work unless you provide an explicit path via \'projectPath\'.');
    }
  }

  private get hotFilePath () {
    return join(this.options.projectPath!, '.diez', 'web-hot-url');
  }

  private get isRunningHot () {
    return existsSync(this.hotFilePath);
  }

  private setAlias (compiler: Compiler) {
    compiler.options.resolve = compiler.options.resolve || {};
    compiler.options.resolve.alias = compiler.options.resolve.alias || {};
    compiler.options.resolve.alias['@diez/styles.scss'] = this.isRunningHot ?
      join(this.options.projectPath!, '.diez', 'web-assets', 'styles.scss') :
      join(this.options.projectPath!, 'build', `${this.options.sdk}-web`, 'static', 'styles.scss');
  }

  private setEnvironmentVariables (compiler: Compiler) {
    if (this.isRunningHot) {
      const hotUrl = readFileSync(this.hotFilePath).toString().trim();
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

  apply (compiler: Compiler) {
    this.validateOptions();
    this.setAlias(compiler);
    this.setEnvironmentVariables(compiler);
  }
}

export = DiezWebpackPlugin;
