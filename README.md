# traversals

[![Coveralls Status][coveralls-image]][coveralls-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]
[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![david-dm][david-dm-image]][david-dm-url]
[![bitHound Code][bithound-image]][bithound-url]
[![Code Climate][codeclimate-image]][codeclimate-url]
[![Codebeat Badge][codebeat-image]][codebeat-url]

> Small module for graph traversals, supporting DFS and BFS with niceties added for pre- and post-order, including their reverses.

## Remove This Section After Reading

Make sure you update this *README* file and remove this section. By using copious amount of *JSDoc* tags you can ensure good code documentation. This module supports the automatic generation of an API document by typing `npm run mddocs` which will create a document `API.md` which you can link to or concatenate to this *README.md* file.

It has also set up a unit test enviroment. Just type `npm test` to execute your unit tests which will be in the `test/` directory. It uses **mocha** and **chai** for testing.

It has `.gitignore`, `.editorconfig`, and `.eslintrc.json` files in the project root.

Here's how to finalize the **git** VCS for this project.

1. Create your repository on https://github.com/julianjensen/traversals (Your project directory is already init'd and staged for commit)
2. Type `git push -u origin master`

## Install

```sh
npm i traversals
```

## Usage

```js
const 
    traversals = require( 'traversals' );

traversals() // true
```

## License

MIT © [Julian Jensen](https://github.com/julianjensen/traversals)

[coveralls-url]: https://coveralls.io/github/julianjensen/traversals?branch=master
[coveralls-image]: https://coveralls.io/repos/github/julianjensen/traversals/badge.svg?branch=master

[travis-url]: https://travis-ci.org/julianjensen/traversals
[travis-image]: http://img.shields.io/travis/julianjensen/traversals.svg

[depstat-url]: https://gemnasium.com/github.com/julianjensen/traversals
[depstat-image]: https://gemnasium.com/badges/github.com/julianjensen/traversals.svg

[npm-url]: https://badge.fury.io/js/traversals
[npm-image]: https://badge.fury.io/js/traversals.svg

[license-url]: https://github.com/julianjensen/traversals/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg

[snyk-url]: https://snyk.io/test/github/julianjensen/traversals
[snyk-image]: https://snyk.io/test/github/julianjensen/traversals/badge.svg

[codacy-url]: https://www.codacy.com/app/julianjensen/traversals?utm_source=github.com&amp;amp;utm_medium=referral&amp;amp;utm_content=julianjensen/traversals&amp;amp;utm_campaign=Badge_Grade
[codacy-image]: https://api.codacy.com/project/badge/Grade/

[david-dm-url]: https://david-dm.org/julianjensen/traversals
[david-dm-image]: https://david-dm.org/julianjensen/traversals.svg

[bithound-url]: https://www.bithound.io/github/julianjensen/traversals
[bithound-image]: https://www.bithound.io/github/julianjensen/traversals/badges/code.svg

[codeclimate-url]: https://codeclimate.com/github/julianjensen/traversals
[codeclimate-image]: https://codeclimate.com/github/julianjensen/traversals/badges/gpa.svg

[codebeat-url]: https://codebeat.co/projects/github-com-undefined-traversals-master
[codebeat-image]: https://codebeat.co/badges/

