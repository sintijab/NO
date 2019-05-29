import React from 'react';
import axios from 'axios';

class Posts extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      cosmic: null,
      loading: true,
      modalOpened: false,
      activePost: [],
      activePostContent: '',
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
    let nI = [];
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
    const nextPostContent = nextPost ? nextPost.content : '';
    debugger;
    this.setState({
      activePost: nextPost,
      activePostContent: nextPostContent,
    })
  }

  displayModal(item) {
    const categories = item.metafields.filter(item => item.key === 'category').map(cat => cat.value);
    var re = /\s*(?:,|$)\s*/;
    var catList = categories[0].split(re);
    this.setState({
      activePost: item,
      activePostContent: item.content,
      catList: catList,
      modalOpened: true,
    });
  }

  render() {
    const { cosmic, activePost, activePostContent = '', modalOpened } = this.state;
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
          {!!activePost._id && !!activePostContent && <div key={activePost._id} className='NO__text NO__image'
            dangerouslySetInnerHTML={{__html: activePostContent}} />}
            {modalOpened && <div className='NO__feed' onClick={this.showSimilarPost}/>}
        </div>
      );
    }
  }

export default Posts;
