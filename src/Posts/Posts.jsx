import React from 'react'
import Post from './Post'


class Posts extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      activePost: [],
      activePostContent: '',
      activePostImg: false,
      activePostVideo: false,
      catList: [],
      postCount: 0,
    }
    this.displayModal = this.displayModal.bind(this)
    this.showSimilarPost = this.showSimilarPost.bind(this)
  }

  showSimilarPost() {
    const { catList, activePost, postCount } = this.state
    const { cosmic, toggleModalOverlay } = this.props
    const newArray = catList.map(item => cosmic.posts.filter(post => post.metadata.NO_category.indexOf(item) !== -1))
    let mergedArr = [].concat.apply([], newArray)
    let repeatedItems = mergedArr.filter(obj => mergedArr.filter(item => item._id === obj._id).length > 1)
    let uRepeatedItems = []
    repeatedItems.forEach(item => {
      if (uRepeatedItems.indexOf(item) === -1) {
        uRepeatedItems.push(item)
      }
    })
    let uniqueItems =  mergedArr.filter(obj => mergedArr.filter(item => item._id === obj._id).length === 1)
    let finalArr = [...uRepeatedItems, ...uniqueItems]
    const activePostIndex = finalArr.indexOf(activePost)
    const newItemIndex = activePostIndex + 1
    if (postCount < finalArr.length - 1) {
      const nextPost = newItemIndex < finalArr.length - 1 ? finalArr[newItemIndex] : finalArr[0]
      this.setState({
        activePost: nextPost,
        activePostImg: nextPost.metadata.NO_img,
        activePostVideo: nextPost.metadata.NO_vid,
        activePostContent: nextPost.metadata.NO_article,
        postCount: postCount + 1,
      })
    } else {
      this.setState({
        activePost: [],
        activePostContent: '',
        activePostImg: false,
        activePostVideo: false,
        catList: [],
        postCount: 0,
      })
      toggleModalOverlay(false, true)
    }
  }

  displayModal(item) {
    const { toggleModalOverlay } = this.props
    const categories = item.metafields.filter(item => item.key === 'NO_category').map(cat => cat.value)
    var re = /\s*(?:,|$)\s*/
    var catList = categories[0].split(re)
    this.setState({
      activePost: item,
      activePostContent: item.metadata.NO_article,
      activePostImg: item.metadata.NO_img,
      activePostVideo: item.metadata.NO_vid,
      catList: catList,
    })
    toggleModalOverlay(true)
  }

  componentDidUpdate() {
    const { showActiveHint = null, activeHint = null, modalOpened } = this.props
    if (showActiveHint && activeHint && !modalOpened) {
      this.setState({activePost: activeHint})
      this.displayModal(activeHint)
    }
  }

  render() {
    const {
      activePost,
      activePostImg = false,
      activePostVideo = false,
      activePostContent = '',
    } = this.state
    const { cosmic, modalOpened } = this.props
    const posts = (cosmic && cosmic.posts) || []
    let post = null
    const dynamicNum = Date.now() / 10000
    var radixPos = String(dynamicNum).indexOf('.') + 1
    var value = String(dynamicNum).slice(radixPos) * 20
      post = posts.map(item => {
        const style = {
          left: `${Math.floor((Math.random() * value) + 1)}px`,
          right: `${Math.floor((Math.random() * value) + 1)}px`,
          top: `${Math.floor((Math.random() * value) + 1)}px`,
          bottom: `${Math.floor((Math.random() * value) + 1)}px`,
        }
        const titleClassNames = `NO__text NO__text-title NO__font--${item.metadata.NO_font_family} NO__font-size--${item.metadata.NO_font_size}`
        return (
            <p key={item._id} onClick={() => this.displayModal(item)} className={titleClassNames} style={style}>{item.title}</p>)
      })

      return (
        <div className="NO__post">
          {!modalOpened && !activePost._id && post}
          {!!activePost._id && modalOpened &&
            <Post
              activePost={activePost}
              activePostImg={activePostImg}
              activePostVideo={activePostVideo}
              activePostContent={activePostContent}
              showSimilarPost={this.showSimilarPost}
            />
          }
        </div>
      )
    }
  }

export default Posts
