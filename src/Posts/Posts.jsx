import React from 'react';
import axios from 'axios';
import LazyImage from '../images/LazyImage.js';
import { replaceAll } from '../functions.js';

class Posts extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      cosmic: null,
      loading: true,
      modalOpened: false,
      activePost: [],
      activePostContent: '',
      activePostImg: '',
      catList: [],
    }
    this.displayModal = this.displayModal.bind(this);
    this.showSimilarPost = this.showSimilarPost.bind(this);
    const _this = this;
    axios.get(`https://api.cosmicjs.com/v1/c61d0730-8187-11e9-9862-534a432d9a60/objects`, {
      params: {
        type: 'posts'
      } })
    .then(function (response) {
      if (!response.data.objects) {
        _this.setState({
          error: true,
          loading: false
        })
      } else {
        _this.setState({
          cosmic: {
            posts: response.data.objects,
          },
          loading: false
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  showSimilarPost() {
    const { cosmic, catList, activePost } = this.state;
    let newArr = [];
    for(let i=0; i < catList.length; i++) {
      let nI = cosmic.posts.filter(item => item.metadata.category.indexOf(catList[i]) !== -1);
      let intersection = newArr.filter(element => nI.includes(element));
      if (intersection.length) {
        const indx = nI.indexOf(intersection[0]);
        nI.splice(indx, 1);
        intersection = 0;
      }
      if (!intersection.length) {
        Array.prototype.push.apply(newArr,nI);
      }
    }
    const activePostIndex = newArr.indexOf(activePost);
    const newItemIndex = activePostIndex !== -1 ? activePostIndex : 0;
    if (activePostIndex !== -1) {
      newArr.splice(activePostIndex, 1);
    }
    const nextPost = newItemIndex < newArr.length ? newArr[newItemIndex] : newArr[0];
    const nextPostImg = nextPost ? nextPost.metadata.NO_img : '';
    this.setState({
      activePost: nextPost,
      activePostImg: nextPostImg,
    })
  }

  displayModal(item) {
    const categories = item.metafields.filter(item => item.key === 'category').map(cat => cat.value);
    var re = /\s*(?:,|$)\s*/;
    var catList = categories[0].split(re);
    debugger;
    this.setState({
      activePost: item,
      activePostContent: item.content,
      activePostImg: item.metadata.NO_img,
      catList: catList,
      modalOpened: true,
    });
  }

  render() {
    const { cosmic, activePost, activePostImg = '', modalOpened } = this.state;
    const posts = (cosmic && cosmic.posts) || [];
    let post = null;
    if (posts.length) {
      post = posts.map(item => {
        return (<p key={item._id} onClick={() => this.displayModal(item)} className='NO__text'>{item.title}</p>);
      });
    }

      return (
        <div>
          {!activePost._id && post}
          {!!activePost._id &&
            <div key={activePost._id} className='NO__text NO__image'>
              <LazyImage src={activePostImg}/>
            </div>}
            {modalOpened && <div className='NO__feed' onClick={this.showSimilarPost}/>}
        </div>
      );
    }
  }

export default Posts;
