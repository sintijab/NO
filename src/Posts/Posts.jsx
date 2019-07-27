import React from 'react';
import axios from 'axios';
import Post from './Post';


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
      activePostVideo: false,
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
      let nI = cosmic.posts.filter(item => item.metadata.NO_category.indexOf(catList[i]) !== -1);
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
          activePostVideo: nextPost.metadata.NO_vid,
          activePostContent: nextPost.metadata.NO_article,
        });
        i = catList.length;
        if (newItemIndex >= newArr.length) {
          this.setState({
            modalOpened: false,
            activePost: [],
            activePostContent: '',
            activePostImg: false,
            activePostVideo: false,
            catList: [],
          })
        }
      }
    }
  }

  displayModal(item) {
    const categories = item.metafields.filter(item => item.key === 'NO_category').map(cat => cat.value);
    var re = /\s*(?:,|$)\s*/;
    var catList = categories[0].split(re);
    this.setState({
      activePost: item,
      activePostContent: item.metadata.NO_article,
      activePostImg: item.metadata.NO_img,
      activePostVideo: item.metadata.NO_vid,
      catList: catList,
      modalOpened: true,
    });
  }

  render() {
    const {
      activePost,
      activePostImg = false,
      activePostVideo = false,
      activePostContent = '',
      modalOpened,
      cosmic,
    } = this.state;
    const { displayGlitch } = this.props;
    const posts = (cosmic && cosmic.posts) || [];
    let post = null;
      post = posts.map(item => {
        const dynamicNum = Math.floor((Math.random() * posts.indexOf(item)) + 1);
        const itemIndex = posts.indexOf(item) * 1000;
        const style = {
          left: `${Math.floor((Math.random() * itemIndex) + 1)}px`,
          right: `${Math.floor((Math.random() * itemIndex) + 1)}px`,
          top: `${Math.floor((Math.random() * itemIndex) + 1)}px`,
          bottom: `${Math.floor((Math.random() * itemIndex) + 1)}px`,
        }
        const titleClassNames = `NO__text NO__text-title NO__font--${item.metadata.NO_font_family} NO__font-size--${item.metadata.NO_font_size}`;
        return (
            <p key={item._id} onClick={() => this.displayModal(item)} onMouseEnter={() => displayGlitch(true)} onMouseOver={() => displayGlitch(true)} onMouseLeave={() => displayGlitch(false)} className={titleClassNames} style={style}>{item.title}</p>);
      });


      return (
        <div className="NO__post">
          {!modalOpened && !activePost._id && post}
          {!!activePost._id && modalOpened &&
            <Post
              activePost={activePost}
              activePostImg={activePostImg}
              activePostVideo={activePostVideo}
              activePostContent={activePostContent}
              showSimilarPost={this.showSimilarPost}/>
          }
        </div>
      );
    }
  }

export default Posts;
