# browser-sync-middleware-firebase-rewrites
A BrowserSync middleware to load the Firebase rewrites rules

[![Build Status](https://travis-ci.org/demsking/browser-sync-middleware-firebase-rewrites.svg?branch=master)](https://travis-ci.org/demsking/browser-sync-middleware-firebase-rewrites)

## Install

`npm install --save-dev browser-sync-middleware-firebase-rewrites`

## Usage

```js
const BASE_DIR = './dist'
const firebaseRewrites = require('browser-sync-middleware-firebase-rewrites')

browserSync.init({
    server: {
        baseDir: BASE_DIR
    },
    middleware: [
        firebaseRewrites({
            firebase: require('./firebase.json'),
            baseDir: BASE_DIR
        })
    ]
})
```

## License

Under the MIT license. See [LICENSE](https://github.com/demsking/browser-sync-middleware-firebase-rewrites/blob/master/LICENSE) file for more details.
