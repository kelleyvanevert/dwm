# What's this?

A quick POC:

- Creating a window with DWM, and compiling it on Apple M1
  - With some immediate mode ish buttons drawn on canvas
  - Skia needs a dynamic library, but we can use `Deno.env.set` to resolve them locally, and then make sure we bundle them along with the executable
- TODO: compile for linux and check that it works
