# @diez/docs-template-app

This is a meta-template Vue.js app. The package is meant to be consumed as a dependency via two provided binary commands:

- `docs-app build`: executes the compilation steps and spits a fully compiled Vue app.
- `docs-app serve`: serves the vue app in development mode with hot reload.

When the app starts or builds, the script will look for two files in the root of the project that is running the command:

- `searchIndex.json`: a pre-built search index, used by our client-side search engine.
- `tree.json`: a JSON representation of the design language (you can check type definitions for the correct up-to-date structure).


## Testing

- E2E tests can be run via `yarn test:e2e`. They are located in `test/e2e`.
- Unit tests can be run via `yarn test:unit`.
