const _ = require("lodash");

// https://devdocs.io/lodash~4/index#kebabCase: _.kebabCase('Foo Bar'); => foo-bar
const slugify = text => _.kebabCase(text);

async function createUniqueSlug(Model, slug, count) {
  const user = await Model.findOne({ slug: `${slug}-${count}` }, "id");

  if (!user) {
    return `${slug}-${count}`;
  }

  return createUniqueSlug(Model, slug, count + 1);
}

async function generateSlug(Model, name, filter = {}) {
  const origSlug = slugify(name);
  const user = await Model.findOne(
    Object.assign({ slug: origSlug }, filter),
    "id"
  );

  if (!user) {
    return origSlug;
  }

  return createUniqueSlug(Model, origSlug, 1);
}
module.exports = generateSlug;
