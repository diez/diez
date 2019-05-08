# `@diez/targets`

This package contains reference target compiler implementations for iOS, Web, and Android targets, including bindings for all of the design system primitives provided by `@diez/designsystem`, and registers associated targets for `ios`, `android`, and `web` with `diez compile --target <target>`.

## Contributing

This package uses the golden test pattern for end to end tests, checking that the target compilers provided produce identical output to what is expected.

If you are contributing to `@diez/targets` and intentionally changed the expected output of golden tests, you can regenerate the canonical outputs that are used to pass the tests by running `yarn regenerate-goldens`. Whenever you do this, please carefully inspect the resulting diff to be sure it's both what you expected and correct.
