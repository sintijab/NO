export const selectPageObj = (sections, sectionName) => sections.filter((section) => section.metadata.navigation === sectionName).reverse()[0]

export const selectUniqueCategories = (sections) => {
  const postCategories = sections.map((item) => item.metadata.NO_category)
  // eslint-disable-next-line
  let uniqueCategories = []
  for (let i = 0; i < postCategories.length; i += 1) {
    if (uniqueCategories.indexOf(postCategories[i]) === -1) {
      uniqueCategories[i] = postCategories[i]
    }
    i += 1
  }
  return uniqueCategories
}
