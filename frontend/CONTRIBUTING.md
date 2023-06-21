# Contributing

## Commit rules

### Commit message

A good commit message should describe what changed and why.

It should:

-   contain a short description of the change (preferably 50 characters or less)
-   be entirely in lowercase with the exception of proper nouns, acronyms, and the words that refer to code, like function/variable names
-   be prefixed with one of the following word
    -   fix : bug fix
    -   hotfix : urgent bug fix
    -   feat : new or updated feature
    -   docs : documentation updates
    -   BREAKING : if commit is a breaking change
    -   refactor : code refactoring (no functional change)
    -   perf : performance improvement
    -   style : UX and display updates
    -   test : tests and CI updates
    -   chore : updates on build, tools, configuration ...
    -   Merge branch : when merging branch
    -   Merge pull request : when merging PR

## React import structure

Standardized way of importing files.

1. Library imports
2. Custom file imports (files written within this project aka, not a 3rd party dependency)
3. Component imports

```
// 1. Library imports
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

// 2. Custom file imports (files written within this project aka, not a 3rd party dependency)
import store from "store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// 3. Component imports
import App from "./App";
```

## Tests

Tests are using the [`Vitest`](https://vitest.dev/) framework

```
yarn test
```
