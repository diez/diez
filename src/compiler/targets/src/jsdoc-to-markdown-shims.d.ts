declare module 'jsdoc-to-markdown' {
  interface JsdocOptions {
    /**
     * By default results are cached to speed up repeat invocations.
     * Set to true to disable this.
     */
    noCache?: boolean;
    /**
     * One or more filenames to process.
     * Accepts globs (e.g. *.js). Either files, source or data must be supplied.
     */
    files?: string|string[];
    /**
     * A string containing source code to process.
     * Either files, source or data must be supplied.
     */
    source?: string;
    /**
     * The path to the jsdoc configuration file.
     *  Default: path/to/jsdoc/conf.json.
     */
    configure?: string;
  }

  class JsdocToMarkdown {
    /**
     * Returns markdown documentation from jsdoc-annoted source code.
     */
    render (options: RenderOptions|JsdocOptions): Promise<string>;
    /**
     * Sync version of render.
     */
    renderSync (options: RenderOptions|JsdocOptions): string;
    /**
     * Returns the template data (jsdoc-parse output) which is fed into the output template (dmd).
     */
    getTemplateData (options: JsdocOptions): Promise<object[]>;
    /**
     * Sync version of getTemplateData.
     */
    getTemplateDataSync (options: JsdocOptions): object[];
    /**
     * Returns raw data direct from the underlying jsdoc3.
     */
    getJsdocData (options: JsdocOptions): Promise<object[]>;
    /**
     * Sync version of getJsdocData.
     */
    getJsdocDataSync (options: JsdocOptions): object[];
    /**
     * By default, the output of each invocation of the main generation methods (render, getTemplateData etc)
     * is stored in the cache (your system's temporary directory).
     * Future jsdoc2md invocations with the same input options and source code will return the output immediately from cache,
     * making the tool much faster/cheaper. If the input options or source code changes,
     * fresh output will be generated. This method clears the cache,
     * which you should never need to do unless the cache is failing for some reason.
     * On Mac OSX, the system tmpdir clears itself every few days meaning your jsdoc2md cache will also be routinely cleared.
     */
    clear (): Promise<void>;
    /**
     * Returns all jsdoc namepaths found in the supplied source code.
     */
    getNamepaths (options: JsdocOptions): Promise<object>;
  }

  /**
   * The default export
   */
  const _default: JsdocToMarkdown;
  export default _default;
}
