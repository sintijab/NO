export const selectPageContent = (sections, sectionName) => {
  const section = sections.filter((item) => item.title === sectionName)[0]
  let updatedContent = [] //eslint-disable-line
  section.metafields.sort((a, b) => a.key.substring('item'.length) - b.key.substring('item'.length)).forEach((item, index) => {
    const text = item.children.filter((obj) => obj.type === 'html-textarea').sort((a, b) => a.key.substring('text'.length) - b.key.substring('text'.length)) || []
    const img = item.children.filter((obj) => obj.type === 'file' && (obj.value.indexOf('jpg') !== -1 || obj.value.indexOf('png') !== -1)).sort((a, b) => a.key.substring('img'.length) - b.key.substring('img'.length)) || []
    updatedContent[index] = {
      text,
      img,
    }
  })
  return updatedContent
}

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

export const selectFieldValue = (fields, key) => {
  const field = fields.filter((fieldValue) => fieldValue.metadata[key])
  return !!field && field.length && field[0].metadata ? field[0].metadata[key] : ''
}

export const mapSoundMetafields = (fields) => {
  let updatedContent = [] //eslint-disable-line
  fields.metafields.sort((a, b) => a.key.substring('link'.length) - b.key.substring('link'.length)).forEach((item, index) => {
    updatedContent[index] = item.value
  })
  return updatedContent
}
