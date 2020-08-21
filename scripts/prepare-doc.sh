#!/usr/bin/env bash

# error out if anything fails.
set -e

PV_SRC=$1
PV_BUILD=$2
WORK_DIR=$3

if [ -z "$PV_SRC" ] || [ -z "$PV_BUILD" ] || [ -z "$WORK_DIR" ]
then
    echo "Usage:"
    echo "  ./prepare-doc.sh /path/to/paraview/src /path/to/paraview/build /path/to/workdir [version]"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------------
# Source version
# -----------------------------------------------------------------------------
if [ -z "$4" ]
then
    VERSION="$4"
else
    VERSION=`git -C $PV_SRC describe`
fi

echo $VERSION

# -----------------------------------------------------------------------------
# Grab Web Content
# -----------------------------------------------------------------------------

mkdir -p $WORK_DIR
cd $WORK_DIR
if [ ! -d "./paraview-docs" ]; then
    git clone https://github.com/Kitware/paraview-docs.git
fi
cd paraview-docs
git config user.email "buildbot@kwrobot02"
git config user.name "buildbot"
git checkout gh-pages

# -----------------------------------------------------------------------------
# Copy Documentation to target
# -----------------------------------------------------------------------------
rm -rf "${WORK_DIR}/paraview-docs/${VERSION}"
mkdir -p "${WORK_DIR}/paraview-docs/${VERSION}"
cp -r "${PV_BUILD}/doc/cxx" "${WORK_DIR}/paraview-docs/${VERSION}/cxx"
cp -r "${PV_BUILD}/doc/python" "${WORK_DIR}/paraview-docs/${VERSION}/python"
rm -rf "${WORK_DIR}/paraview-docs/${VERSION}/python/.doctrees"

# -----------------------------------------------------------------------------
# update available `versions` file.
# -----------------------------------------------------------------------------
cd "${WORK_DIR}/paraview-docs/"
ls -d */ | cut -d "/"  -f 1 > versions

# -----------------------------------------------------------------------------
# Commit to server
# -----------------------------------------------------------------------------

cd "${WORK_DIR}/paraview-docs/"
git add "$VERSION"
git commit -a -m "Update documentation for version $VERSION"
git push origin gh-pages
