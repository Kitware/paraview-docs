# Paraview-doc

Automated publication of ParaView documentation via github pages.

## selector.js

This script injects a version selector into the C++ and python documentation. It selects a header element of the docs and appends a `<select>` element with a version list.

To build with webpack:
* `npm install`
* `npm run build:release`

The resulting script is `dist/paraview-version.js`.

It should be inserted before the closing body element `</body>` with: `<script type="text/javascript" src="paraview-version.js"></script>`, using a post-processing step on the automatically generated documentation. This has yet to be written - testing has been with hand-edited files.

A ParaView release can trigger a new sub-directory of the documentation, and a new entry in the version list in this script.

## Shell script to automate publication

```
./scripts/prepare-doc.sh /path/to/paraview/src /path/to/paraview/build /path/to/workdir
```

For nightly you may want to use/edit the given script to force the name of the version to be `nighlty` instead of the result of `git describe`.

## How to update the script

You will need to copy and commit dist/paraview-version.js from master to the root of gh-pages directory.