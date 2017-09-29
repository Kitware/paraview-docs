PV_SRC=$1
PV_BUILD=$2
WORK_DIR=$3

if [ -z "$PV_SRC" ] || [ -z "$PV_BUILD" ] || [ -z "$WORK_DIR" ]
then
    echo "Usage:"
    echo "  ./prepare-doc.sh /path/to/paraview/src /path/to/paraview/build /path/to/workdir"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------------
# Source version
# -----------------------------------------------------------------------------

cd $PV_SRC
VERSION=`git describe`
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
git checkout gh-pages

# -----------------------------------------------------------------------------
# Copy Documentation to target
# -----------------------------------------------------------------------------

rm -rf "${WORK_DIR}/paraview-docs/${VERSION}"
mkdir -p "${WORK_DIR}/paraview-docs/${VERSION}"
cp -r "${PV_BUILD}/www/cxx-doc" "${WORK_DIR}/paraview-docs/${VERSION}/cxx"
cp -r "${PV_BUILD}/www/py-doc" "${WORK_DIR}/paraview-docs/${VERSION}/python"
mv "${WORK_DIR}/paraview-docs/${VERSION}/python/_static" "${WORK_DIR}/paraview-docs/${VERSION}/python/static"
mv "${WORK_DIR}/paraview-docs/${VERSION}/python/_sources" "${WORK_DIR}/paraview-docs/${VERSION}/python/sources"
mv "${WORK_DIR}/paraview-docs/${VERSION}/python/_modules" "${WORK_DIR}/paraview-docs/${VERSION}/python/modules"
rm -rf "${WORK_DIR}/paraview-docs/${VERSION}/python/.doctrees"

# -----------------------------------------------------------------------------
# Patch documentation
# -----------------------------------------------------------------------------

cd "${WORK_DIR}/paraview-docs/${VERSION}"
find . -type f -name \*.html -exec sed -i '' -e "s:</body>:<script type="text/javascript" src="/paraview-docs/paraview-version.js"></script></body>:g" {} \;
find ./python -type f -name \*.html -exec sed -i '' -e "s/_static/static/g" {} \;
find ./python -type f -name \*.html -exec sed -i '' -e "s/_modules/modules/g" {} \;
find ./python -type f -name \*.html -exec sed -i '' -e "s/_sources/sources/g" {} \;
cd ..
find . -type d -depth 1 | grep -v git | cut -d "/" -f 2 > versions

# -----------------------------------------------------------------------------
# Commit to server
# -----------------------------------------------------------------------------

