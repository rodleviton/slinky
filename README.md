![Slinky](https://github.com/ReactivePixels/slinky/blob/master/images/slinky-masthead-02.png)

# Slinky
> A GUI for npm link management

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
[![Build Status](https://travis-ci.org/ReactivePixels/slinky.svg?branch=master)](https://travis-ci.org/ReactivePixels/slinky)

## Why Slinky?
__In short__ - Slinky takes the hard work out of managing your npm link dependencies.

__In depth__ - As a JavaScript developer it is not uncommon to have to manage and develop multiple interconnected packages. To assist with 
local development of these packages many of us will use the [npm link](https://docs.npmjs.com/cli/link) command. While this does a great
job of providing an API to aid local development it can be a very tedious and manual exercise to orchestrate.

A quick example to illustrate the steps involved to 'link' a locally developed package to a project:

__Step 1.__ Navigate to package and 'link' so that it is globally available
```
cd path/to/my-npm-package
npm link
```

__Step 2.__ Navigate to project that has this dependency and 'link'
```
cd path/to/my-project
npm link my-npm-package
```

__Step 3.__ When finished development you will need to remember to 'unlink' the dependency
```
cd path/to/my-project
npm unlink my-npm-package
```

__Step 4.__ Finally you will need to 'unlink' the package so that it is no longer globally available
```
cd path/to/my-npm-package
npm unlink
```

So many steps and imagine having to manage more than one linked package! Our nightmare does not end here either. 
The process for checking what packages we have linked to a specific project is less than ideal. 
In fact there is no API provided for us by npm. One unofficial technique is to __grep__ the *node_modules* folder 
within your project for symlinked modules.

```
cd path/to/my-project
ls -l node_modules | grep ^l
```

There must be a better way!

---

## How Slinky?

Slinky tries to improve this long winded experience by providing an easy to use GUI that reduces 
the mental overhead required for 'linking' packages. As a developer you will still be required to run __Step 1.__ and __Step 4.__ to 'link'
and 'unlink' your packages globally but once this has been done it as simple as choosing the folder where your project lives and Slinky
will show you what npm packages you have available to 'link' and what packages you have already 'linked'.

![Slinky Demo](https://github.com/ReactivePixels/slinky/blob/master/images/slinky-demo.gif)

See how much better that is!

---

## Get Slinky!

Download your flavour of slinky here:

https://reactivepixels.github.io/get-slinky/

---

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how you can extend Slinky.

### License

This software is licensed under the MIT Licence. See [LICENSE](https://github.com/ReactivePixels/slinky/blob/master/LICENSE.md).