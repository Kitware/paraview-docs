# Paraview-doc

Automated publication of ParaView documentation via github pages.

## selector.js

This script injects a version selector into the C++ and Python documentation. It selects a header element of the docs and appends a `<select>` element with a version list as well as a link to the other language documentation.

To build with webpack:
* `npm install`
* `npm run build:release`

The resulting script is `dist/paraview-version.js`.

## Shell script to automate publication

```
./scripts/prepare-doc.sh /path/to/paraview/src /path/to/paraview/build /path/to/workdir
```

For nightly you may want to use/edit the given script to force the name of the version to be `nighlty` instead of the result of `git describe`.

## How to update the generated script

You will need to copy and commit dist/paraview-version.js from master to the root of gh-pages directory.