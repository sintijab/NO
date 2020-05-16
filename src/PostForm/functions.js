const getParams = (params) => {
  const {
    title,
    article,
    author,
    imgurl,
    videourl,
    categories,
    font,
    fontSize,
  } = params
  return {
    title,
    type_slug: 'posts',
    content: '',
    status: 'draft',
    metafields: [
      {
        value: article.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        key: 'NO_article',
        title: 'Description',
        type: 'textarea',
        children: null,
      },
      {
        helptext: 'The link of the new post image',
        value: imgurl.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        key: 'NO_img',
        title: 'Image link',
        type: 'text',
        children: null,
      },
      {
        helptext: 'The link of the new post image',
        value: author.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        key: 'no_author',
        title: 'Author',
        type: 'text',
        children: null,
      },
      {
        helptext: 'The link of the new post video e.g. \nhttps://youtu.be/n7hzomuDEIk',
        value: videourl.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        key: 'NO_video',
        title: 'Video link',
        type: 'text',
        children: null,
      },
      {
        required: true,
        helptext: 'one or multiple categories possible separated by commas e.g. testcategory, nocategory, newcategory, blablabla',
        value: categories.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\s/g, ''),
        key: 'NO_category',
        title: 'Category',
        type: 'text',
        children: null,
      },
      {
        options: [
          {
            key: 'default',
            value: 'default',
          },
          {
            key: 'permanent-marker',
            value: 'permanent-marker',
          },
          {
            key: 'archivo-black',
            value: 'archivo-black',
          },
          {
            key: 'megrim',
            value: 'megrim',
          },
          {
            key: 'vidaloka',
            value: 'vidaloka',
          },
          {
            key: 'allerta-stencil',
            value: 'allerta-stencil',
          },
          {
            key: 'press-start-2p',
            value: 'press-start-2p',
          },
          {
            key: 'cutive-mono',
            value: 'cutive-mono',
          },
          {
            key: 'major-mono-display',
            value: 'major-mono-display',
          },
          {
            key: 'cormorant-sc',
            value: 'cormorant-sc',
          },
          {
            key: 'zcool-kuaiLe',
            value: 'zcool-kuaiLe',
          },
          {
            key: 'montserrat-subrayada',
            value: 'montserrat-subrayada',
          },
          {
            key: 'anton',
            value: 'anton',
          },
          {
            key: 'share-tech-mono',
            value: 'share-tech-mono',
          },
          {
            key: 'libre-barcode-39',
            value: 'libre-barcode-39',
          },
          {
            key: 'monsieur-la-doulaise',
            value: 'monsieur-la-doulaise',
          },
          {
            key: 'zilla-slab-highlight',
            value: 'zilla-slab-highlight',
          },
          {
            key: 'monofett',
            value: 'monofett',
          },
          {
            key: 'times-new-roman',
            value: 'times-new-roman',
          },
        ],
        value: font,
        key: 'NO_font_family',
        title: 'Font family of hidden title',
        type: 'select-dropdown',
        children: null,
      },
      {
        options: [
          {
            key: '1',
            value: '1',
          },
          {
            key: '1-2',
            value: '1-2',
          },
          {
            key: '1-5',
            value: '1-5',
          },
          {
            key: '1-7',
            value: '1-7',
          },
          {
            key: '2',
            value: '2',
          },
          {
            key: '2-2',
            value: '2-2',
          },
          {
            key: '2-5',
            value: '2-5',
          },
          {
            key: '2-7',
            value: '2-7',
          },
          {
            key: '3',
            value: '3',
          },
        ],
        helptext: 'font size by em, eg. 1-2 for 1.2em, 1-7 for 1.7em etc',
        value: fontSize,
        key: 'NO_font_size',
        title: 'Font size of hidden title',
        type: 'select-dropdown',
        children: null,
      },
    ],
    options: {
      slug_field: false,
    },
  }
}

export default getParams
