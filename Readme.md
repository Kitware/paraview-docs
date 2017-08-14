# Paraview-doc

Automated publication of ParaView documentation via github pages.

## selector.js

This script injects a version selector into the C++ and python documentation. It selects a header element of the docs and appends a `<select>` element with a version list.

To build with webpack:
* `npm install`
* `npm run build`

The resulting script is `dist/paraview-version.js`.

It should be inserted before the closing body element `</body>` with: `<script type="text/javascript" src="paraview-version.js"></script>`, using a post-processing step on the automatically generated documentation. This has yet to be written - testing has been with hand-edited files.

A ParaView release can trigger a new sub-directory of the documentation, and a new entry in the version list in this script.
