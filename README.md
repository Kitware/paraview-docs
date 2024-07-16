# Paraview-doc

Automated publication of ParaView documentation via GitHub pages.

Given Paraview source and build trees, tt provides the infrastructure for
* generating the associated ParaView C++ and Python API documentation
* automatically updating the site available at https://kitware.github.io/paraview-docs/ after changes are pushed onto the `gh-pages` branch

The updates to the `gh-pages` branch are pushed every night by the official "dashboard" build & testing ParaView and maintained by [@Kitware](https://github.com/Kitware).

Note that the project hosting the user's guide, reference manual and tutorials published at https://docs.paraview.org is hosted at https://gitlab.kitware.com/paraview/paraview-docs.

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

For nightly or latest (i.e. latest release) you can pass in an additional parameter on  the command line
which is the name to use instead of `git describe` e.g.

```
./scripts/prepare-doc.sh /path/to/paraview/src /path/to/paraview/build /path/to/workdir nightly
```

## Updating ParaView docs

Here are steps to update the ParaView docs manually. The instructions are have been tested
on a Linux system.

* Checkout ParaView source for appropriate version.
* Build ParaView with `PARAVIEW_BUILD_DEVELOPER_DOCUMENTATION` CMake flag turned ON. You may also
  want to enable all appropriate features e.g. Python support, MPI support. With
  Python, make sure the `sphinx-build:FILEPATH` points to the sphix-build script
  for correct version of Python.
* Build ParaView normally. This is necessary to ensure everything is built
  correctly.
* Build the `ParaViewDoc-TGZ` target e.g. `ninja ParaViewDoc-TGZ`. This will
  generate the Doxygen and Sphinx generated docs.
* Now run `prepare-doc` script to push the generated docs to this repo. Provide
  the optional `version` command line argument when generated docs for `latest`
  or `nightly` instead of using the value obtained from `git describe` executed
  on the source directory. The script will update and push the documentation
  changes to the `gh-pages` branch on this repo.
* When adding a new version, you should edit the `versions.json` file in the
  `gh-pages` branch to ensure it all the versions listed and labelled correctly.
  When adding new commits to gh-pages branch, ensure that last commit is the nightly
  doc update commit since the automatic builders amend the last commit.

## How to update the generated script

You will need to copy and commit dist/paraview-version.js from master to the root of gh-pages directory.
