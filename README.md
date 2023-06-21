# Adrift Native

[Adrift](https://github.com/hmerritt/adrift) is a template for React apps with batteries included.

Adrift Native can run your apps _natively_ as a Windows and Mac app (outside the browser as a standalone app).

Initial binary size (for Windows) is less-than 10MB, and as low as **3MB** when compressed with [upx](https://upx.github.io/).

![](https://imgur.com/b1IxXg9.gif)

## Getting started

Quickstart by building the app yourself:

1.  Install Wails dependencies ([detailed instructions here](https://wails.io/docs/gettingstarted/installation))

    -   [`go-lang`](https://go.dev/dl/)
    -   [`yarn`](https://yarnpkg.com/getting-started/install)
    -   [`Wails CLI`](https://wails.io/docs/gettingstarted/installation/#installing-wails) - `$ go install github.com/wailsapp/wails/v2/cmd/wails@latest`
    -   `$ go mod download`
    -   (Optional) [`nsis` windows installer](https://sourceforge.net/projects/nsis/)
    -   (Optional) [`upx` compress binary](https://upx.github.io/)

2.  Clone this repo
3.  Run `$ wails build`

## Scripts

Develop live with hot-reload:

```
wails dev
```

Cross-platform + production build command:

```
$ wails build -platform "windows/amd64,darwin/universal,linux/amd64" -ldflags "-s -w"
```

Build windows installer with `nsis`

```
$ wails build -platform "windows/amd64" -ldflags "-s -w" -nsis
```

## Documentation

-   [wails.io/docs](https://wails.io/docs)
-   [wails project config](https://wails.io/docs/reference/project-config)
-   [build readme](build/README.md)
-   [frontend readme](frontend/README.md)

## Electron? - Nope!

[wails.io](https://wails.io) - Build beautiful cross-platform applications using Go.

Wails relies on WebView:

-   Less memory usage
-   Smaller binary size (<10MB)
-   Written in Go (Go is a better language for native apps from JS, and easier to work with than C/C++/Rust)
