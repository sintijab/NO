import React from 'react';
import { getCookie } from '../functions.js';
const Cosmic = require('cosmicjs')();

class PostForm extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      cosmic: null,
      title: '',
      article: '',
      imgurl: '',
      font: '',
      font_size: '',
      categories: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.selected_font = React.createRef();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
        [name]: value,
    });
    }

  handleSubmit(event) {
    event.preventDefault();

    const { title, article, font, font_size, imgurl, categories } = this.state;
    const { submit } = this.props;
    const params = {
      title: title,
      type_slug: 'posts',
      content: '',
      status: 'draft',
      metafields: [
        {
          value: article,
          key: 'NO_article',
          title: 'Description',
          type: 'textarea',
          children: null
        },
        {
          helptext: 'The link of the new post image e.g. \nhttps://scontent.ftxl2-1.fna.fbcdn.net/v/t1.0-9/59888899_546009472589513_1027294389803679744_o.jpg?_nc_cat=111&_nc_ht=scontent.ftxl2-1.fna&oh=339177f7bdaf98887421c83a21eac584&oe=5D580DD3',
          value: imgurl,
          key: 'NO_img',
          title: 'Image link',
          type: 'text',
          children: null
        },
        {
          required: true,
          helptext: 'one or multiple categories possible separated by commas e.g. testcategory, nocategory, newcategory, blablabla',
          value: categories,
          key: 'NO_category',
          title: 'Category',
          type: 'text',
          children: null
        },
        {
         options: [
            {
               key:"default",
               value:"default"
            },
            {
               key:"permanent-marker",
               value:"permanent-marker"
            },
            {
               key:"archivo-black",
               value:"archivo-black"
            },
            {
               key:"megrim",
               value:"megrim"
            },
            {
               key:"vidaloka",
               value:"vidaloka"
            },
            {
               key:"allerta-stencil",
               value:"allerta-stencil"
            },
            {
               key:"press-start-2p",
               value:"press-start-2p"
            },
            {
               key:"cutive-mono",
               value:"cutive-mono"
            },
            {
               key:"major-mono-display",
               value:"major-mono-display"
            },
            {
               key:"cormorant-sc",
               value:"cormorant-sc"
            },
            {
               key:"zcool-kuaiLe",
               value:"zcool-kuaiLe"
            },
            {
               key:"montserrat-subrayada",
               value:"montserrat-subrayada"
            },
            {
               key:"anton",
               value:"anton"
            },
            {
               key:"share-tech-mono",
               value:"share-tech-mono"
            },
            {
               key:"libre-barcode-39",
               value:"libre-barcode-39"
            },
            {
               key:"monsieur-la-doulaise",
               value:"monsieur-la-doulaise"
            },
            {
               key:"zilla-slab-highlight",
               value:"zilla-slab-highlight"
            },
            {
               key:"monofett",
               value:"monofett"
            },
            {
               key:"times-new-roman",
               value:"times-new-roman"
            }
           ],
           value: font,
           key:"NO_font_family",
           title:"Font family of hidden title",
           type:"select-dropdown",
           children: null
        },
        {
           options: [
              {
                key:"1",
                value:"1"
              },
              {
                key:"1-2",
                value:"1-2"
              },
              {
                key:"1-5",
                value:"1-5"
              },
              {
                key:"1-7",
                value:"1-7"
              },
              {
                key:"2",
                value:"2"
              },
              {
                key:"2-2",
                value:"2-2"
              },
              {
                key:"2-5",
                value:"2-5"
              },
              {
                key:"2-7",
                value:"2-7"
              },
              {
                key:"3",
                value:"3"
              }
           ],
           helptext:"font size by em, eg. 1-2 for 1.2em, 1-7 for 1.7em etc",
           value: font_size,
           key: "NO_font_size",
           title: "Font size of hidden title",
           type: "select-dropdown",
           children: null
        }
      ],
      options: {
        slug_field: false
      }
    }
    if(!!getCookie('val')) {
    const Cosmic = require('cosmicjs')({
      token: getCookie('val') // optional
    })
    Cosmic.getBuckets()
    .then(data => {
      console.log(data)
      const bucket = Cosmic.bucket({
        slug: data.buckets[0].slug,
        write_key: ''
      })

    bucket.addObject(params)
    .then(data => {
      this.setState({
        title: '',
        article: '',
        imgurl: '',
        font: '',
        font_size: '',
        categories: ''
      });
      submit(true)
    })
    .catch(err => {
      console.log(err)
    })
    })
    .catch(err => {
      console.log(err)
    })

    } else {
      console.log('please contact us in order to publish posts')
    }
  }


  render() {
    const { title = '', article, imgurl, font, font_size, categories } = this.state;
    const fontName = `NO__font--${font} NO__font-size--${font_size}`;
    const fontPreviewText = <span className={fontName}>{title}</span>;

      return (
        <div>
        <form className='NO__post_form' onSubmit={this.handleSubmit}>
          <div className="NO__post_form-group">
            <input id="title" type="text" name="title" className="NO__post_form-control" placeholder="Title" value={title} onChange={this.handleChange}/>
            <select className="NO__post_form-control" name="font" value={font} onChange={this.handleChange}>
              <option value="default" label >Font style: default PT Mono</option>
              <option value="permanent-marker">permanent-marker</option>
              <option value="archivo-black">archivo-black</option>
              <option value="megrim">megrim</option>
              <option value="vidaloka">vidaloka</option>
              <option value="allerta-stencil">allerta-stencil</option>
              <option value="press-start-2p">press-start-2p</option>
              <option value="cutive-mono">cutive-mono</option>
              <option value="major-mono-display">major-mono-display</option>
              <option value="cormorant-sc">cormorant-sc</option>
              <option value="zcool-kuaiLe">zcool-kuaiLe</option>
              <option value="montserrat-subrayada">montserrat-subrayada</option>
              <option value="anton">anton</option>
              <option value="share-tech-mono">share-tech-mono</option>
              <option value="libre-barcode-39">libre-barcode-39</option>
              <option value="monsieur-la-doulaise">monsieur-la-doulaise</option>
              <option value="zilla-slab-highlight">zilla-slab-highlight</option>
              <option value="monofett">monofett</option>
              <option value="times-new-roman">times-new-roman</option>
            </select>
            <select className="NO__post_form-control" name="font_size" value={font_size} onChange={this.handleChange}>
              <option value="1" label >Font size: 1rem</option>
              <option value="1-2">1.2rem</option>
              <option value="1-5">1.5rem</option>
              <option value="1-7">1.7rem</option>
              <option value="2">2rem</option>
              <option value="2-2">2.2rem</option>
              <option value="2-5">2.5rem</option>
              <option value="2-7">2.7rem</option>
              <option value="3">3rem</option>
            </select>
            <p style={{background:'white'}}>{fontPreviewText}<span style={{float:'right', padding: '3px'}}>title preview</span></p>
            <textarea id="article" rows="30" type="text" name="article" className="NO__post_form-control NO__form-text-area" placeholder="Description" value={article} onChange={this.handleChange}/>
            <input id="imgurl" value={imgurl} type="url" name="imgurl" className="NO__post_form-control" placeholder="ImgLink" onChange={this.handleChange}/><br/>
            <input id="categories" required type="text" name="categories" className="NO__post_form-control" placeholder="categories" value={categories} onChange={this.handleChange}/>
            <button className="btn btn-info NO__post_form-control--submit">Submit</button>
          </div>
        </form>
        </div>
      );
    }
  }

export default PostForm;
