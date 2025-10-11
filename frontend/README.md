# Adrift

Template react app with batteries included 🔋

- [Vite](https://vitejs.dev)
- [Vitest (testing for Vite)](https://vitest.dev/)
- [Playwright (testing end-to-end)](https://playwright.dev)
- [Typescript](https://www.typescriptlang.org)
- [TanStack Store](https://tanstack.com/store/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [StyleX](https://stylexjs.com/)
- Custom (hackable) build script
- Custom utils and helper functions
    - Global `log` functions with more functionality than `console.log`
    - Global `feature` flag function

> Checkout [Adrift Native](https://github.com/hmerritt/adrift-native) to run Adrift apps natively on Windows, Mac, and Linux.

## Getting started

**_Quick start_**, get up an running in one command:

```bash
git clone https://github.com/hmerritt/adrift && cd adrift && yarn && yarn dev
```

Clone this repo and run one of the following scripts:

Available scripts (run using `yarn <script>` or `npm run <script>`):

- `dev` - starts Vite dev server for local development
- `test` - runs all test files
- `preview` - similar to `dev`, but uses production mode to simulate the final build
- `build` - builds the project to `dist` directory

## Features

- [Custom functions](#custom-functions)
    - [Logs](#log-and-debug-functions)
    - [Feature flag](#feature-flag-function)
- [Styles](#styling-stylex)

### Custom functions

#### `log`, and `debug` functions

Anywhere in the code you can call `log()`, or `debug()` (no imports needed).

> `debug`, and `debugn` will only log in development.

```js
// Behaves like `console.log`
log("hello, world!");

// This will log with `console.error`
log.error("websocket error");
```

You can also call `logn()`, and `debugn()`. This namespaces each log so you can keep track of multiple things at once.

```js
//    Namespace  Log message
logn("socket", "Initiated websocket connection");

// This will log with `console.error`
logn.error("socket", "websocket error");
```

> [timestamp] +[time since last log in ms] [namespace] [log message]

![](https://i.imgur.com/VlkNmdi.png)

#### `feature` flag function

`feature(flag)` will return `true` if the flag is set.

Flags need to be added manually in `src/global/featureFlags` to the `featureFlags` object.

```js
if (feature("myAwesomeFlag")) {
	// Do something
}
```

### Styling (StyleX)

Adrift uses StyleX, a **Zero runtime** CSS in JS library.

StyleX builds optimized styles using collision-free atomic CSS which is superior to what could be authored and maintained by hand.

> Other popular libraries such as `styled-components` can negatively impact app performance due to their use of a runtime.
>
> Styling runtimes are usually okay for small apps, but don't scale very well when there are lots of styles for the runtime to handle.
