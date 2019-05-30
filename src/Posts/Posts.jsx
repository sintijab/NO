import React from 'react';
import axios from 'axios';
import LazyImage from '../images/LazyImage.js';

class Posts extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      cosmic: null,
      loading: true,
      modalOpened: false,
      activePost: [],
      activePostContent: '',
      activePostImg: false,
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
        const indx = nI.indexOf(intersection[0]) - 1;
        nI.splice(indx, 1);
        intersection = 0;
      }
      if (!intersection.length) {
        Array.prototype.push.apply(newArr,nI);
        const activePostIndex = newArr.indexOf(activePost);
        const newItemIndex = activePostIndex + 1;
        const nextPost = newItemIndex < newArr.length ? newArr[newItemIndex] : newArr[0];
        this.setState({
          activePost: nextPost,
          activePostImg: nextPost.metadata.NO_img,
          activePostContent: nextPost.metadata.NO_article,
        });
        i = catList.length;
      }
    }
  }

  displayModal(item) {
    const categories = item.metafields.filter(item => item.key === 'category').map(cat => cat.value);
    var re = /\s*(?:,|$)\s*/;
    var catList = categories[0].split(re);
    this.setState({
      activePost: item,
      activePostContent: item.metadata.NO_article,
      activePostImg: item.metadata.NO_img,
      catList: catList,
      modalOpened: true,
    });
  }

  render() {
    const { cosmic, activePost, activePostImg = false, activePostContent = '', modalOpened } = this.state;
    const posts = (cosmic && cosmic.posts) || [];
    let post = null;
    if (posts.length) {
      post = posts.map(item => {
        const range = Math.floor((Math.random() * 20000) + 1);
        const style = {
          left: `${Math.floor((Math.random() * range) + 1)}px`,
          right: `${Math.floor((Math.random() * range) + 1)}px`,
          top: `${Math.floor((Math.random() * range) + 1)}px`,
          bottom: `${Math.floor((Math.random() * range) + 1)}px`,
        }
        return (<p key={item._id} onClick={() => this.displayModal(item)} className='NO__text NO__text-title' style={style}>{item.title}</p>);
      });
    }

      return (
        <div>
          {!modalOpened && !activePost._id && post}
          {!!activePost._id && modalOpened &&
             <div key={activePost._id} onClick={this.showSimilarPost}>
              {activePostImg && <LazyImage src={activePostImg} className='NO__overlay-img' />}
              <h3 className='NO__text NO__paragraph NO__h3'>{activePost.title}</h3><br/>
              <p className='NO__text NO__paragraph'>{activePostContent}</p>
            </div>}
        </div>
      );
    }
  }

export default Posts;
