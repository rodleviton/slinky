![Slinky](https://github.com/rodleviton/slinky/blob/master/images/slinky-masthead.png)

> A GUI for npm link management

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()


![Slinky Demo](https://github.com/rodleviton/slinky/blob/master/images/slinky-demo.gif)

## Why Slinky?
__In short__ - Slinky takes the hard work out of managing your npm link dependencies.

__In depth__ - As a JavaScript developer it is not uncommon to have to manage and develop multiple interconnected packages. To assist with 
local development of these packages many of us will use the [npm 'link'](https://docs.npmjs.com/cli/link) command. While this does a great
job of providing an API to aid local development it can be a very tedious and manual exercise to orchestrate.

A quick example to illustrate the steps involved to 'link' a locally developed package to a project:

__Step 1.__ Navigate to package and 'link' so that it is globally available
```
cd path/to/my-npm-package
npm link
```

__Step 2.__ Navigate to your project that has this dependency and 'link'
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
In fact there is not API for this provided by npm. One unofficial technique is to __grep__ the *node_modules* folder 
with your project for symlinked modules.

```
cd path/to/my-project
ls -l node_modules | grep ^l
```

------------------------------------------------------------------------

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how you can extend Slinky.

### License

This software is licensed under the MIT Licence. See [LICENSE](https://github.com/rodleviton/slinky/blob/master/LICENSE.md).