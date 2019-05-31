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
      url: '',
      font: '',
      font_size: '',
      vidurl: '',
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
        [name]: value
    });
    }

  handleSubmit(event) {
    event.preventDefault();

    const { title, article, url, font, font_size, vidurl, categories } = this.state;
    const { submit } = this.props;
    console.log({title, article, url})
    const params = {
      title: title,
      type_slug: 'posts',
      content: '',
      status: 'draft',
      metafields: [
        {
          key: 'NO_vid',
          type: 'text',
          value: vidurl
        },
        {
          key: 'NO_article',
          type: 'text',
          value: article
        },
        {
          key: 'NO_img',
          type: 'text',
          value: url
        },
        {
          key: 'NO_category',
          type: 'text',
          value: categories
        },
        {
          key: 'NO_font_family',
          type: 'text',
          value: font
        },
        {
          key: 'NO_font_size',
          type: 'text',
          value: font_size
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
      console.log(data)
      this.setState({
        title: '',
        article: '',
        url: '',
        font: '',
        font_size: '',
        vidurl: '',
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
    const { title = '', article, url, font, font_size, vidurl, categories } = this.state;
    const fontName = `NO__font--${font} NO__font-size--${font_size}`;
    const fontPreviewText = <span className={fontName}>{title}</span>;

      return (
        <div>
        <form className='NO__post_form' onSubmit={this.handleSubmit}>
          <div className="NO__post_form-group">
            <input id="title" type="text" name="title" className="NO__post_form-control" placeholder="Title" value={title} onChange={this.handleChange}/>
            <select className="NO__post_form-control" name="font" value={font} onChange={this.handleChange}>
              <option value="default" label >Font style: Montserrat</option>
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
            <input id="url" type="url" name="url" className="NO__post_form-control" placeholder="ImgLink" value={url} onChange={this.handleChange}/><br/>
            <input id="vidurl" type="url" name="vidurl" className="NO__post_form-control" placeholder="VideoLink" value={vidurl} onChange={this.handleChange}/><br/>
            <input id="categories" type="text" name="categories" className="NO__post_form-control" placeholder="categories" value={categories} onChange={this.handleChange}/>
            <button className="btn btn-info NO__post_form-control--submit">Submit</button>
          </div>
        </form>
        </div>
      );
    }
  }

export default PostForm;
