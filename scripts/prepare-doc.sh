#!/usr/bin/env bash

# error out if anything fails.
set -e

PV_SRC=$1
PV_BUILD=$2
WORK_DIR=$3
UPDATE_LATEST="false"

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
if [ -n "$4" ]
then
    VERSION="$4"
    UPDATE_LATEST="true"
else
    VERSION=$(git -C "$PV_SRC" describe)
fi

echo "$VERSION"

# -----------------------------------------------------------------------------
# Grab Web Content
# -----------------------------------------------------------------------------

mkdir -p "$WORK_DIR"
cd "$WORK_DIR"
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
find . -maxdepth 1 -type d -not -iname '.*' -printf "%f\n" | sort -u > versions

# -----------------------------------------------------------------------------
# update available `versions.json` file.
# -----------------------------------------------------------------------------
GENERATED_TAGS="$(find . -maxdepth 1 -type d  -name 'v*' -printf "%f\n" | sort -r |
  sed '
     # Every line
     {
       s/v\(.*\)/{ "value": "v\1",  "label": "\1"}/
     }
     # Every line but the last one
     $! {
       s/$/,/
     }'
     )"

cat << EOF > versions.json
[
{ "value": "nightly", "label": "nightly (development)" },
{ "value": "latest",  "label": "latest release (5.10.*)" },
$GENERATED_TAGS
]
EOF

# -----------------------------------------------------------------------------
# Commit to server
# -----------------------------------------------------------------------------

if [ "$PARAVIEW_DOC_UPLOAD" = "true" ]; then
    cd "${WORK_DIR}/paraview-docs/"
    ls

    if [ "$UPDATE_LATEST" = "true" ]; then
      ls "$VERSION/"
      cp -r "$VERSION/*" latest/
    fi

    git add "$VERSION"
    # we simply amend the last commit and force-push
    git commit -a -m "Update documentation for version $VERSION"
    git push origin gh-pages -f
fi
