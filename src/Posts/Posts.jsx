/* eslint react/prop-types: 0 */
import React from 'react'
import Post from './Post'

class Posts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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

  componentDidUpdate() {
    const { showActiveHint = null, activeHint = null, modalOpened } = this.props
    if (showActiveHint && activeHint && !modalOpened) {
      // eslint-disable-next-line
      this.setState({ activePost: activeHint })
      this.displayModal(activeHint)
    }
  }

  showSimilarPost() {
    const { catList, activePost, postCount } = this.state
    const { cosmic, toggleModalOverlay } = this.props
    // eslint-disable-next-line
    const newArray = catList.map((item) => cosmic.posts.filter((post) => post.metadata.NO_category.indexOf(item) !== -1))
    // eslint-disable-next-line
    let mergedArr = [].concat.apply([], newArray)
    // eslint-disable-next-line
    let repeatedItems = mergedArr.filter((obj) => mergedArr.filter((item) => item._id === obj._id).length > 1)
    // eslint-disable-next-line
    let uRepeatedItems = []
    repeatedItems.forEach((item) => {
      if (uRepeatedItems.indexOf(item) === -1) {
        uRepeatedItems.push(item)
      }
    })
    // eslint-disable-next-line
    let uniqueItems = mergedArr.filter((obj) => mergedArr.filter((item) => item._id === obj._id).length === 1)
    const finalArr = [...uRepeatedItems, ...uniqueItems]
    const activePostIndex = finalArr.indexOf(activePost)
    const newItemIndex = activePostIndex + 1
    if (postCount < finalArr.length - 1) {
      const nextPost = newItemIndex < finalArr.length - 1 ? finalArr[newItemIndex] : finalArr[0]
      this.setState({
        activePost: nextPost,
        activePostImg: nextPost.metadata.NO_img,
        activePostVideo: nextPost.metadata.NO_video,
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
    const categories = item.metafields.filter((field) => field.key === 'NO_category').map((cat) => cat.value)
    const re = /\s*(?:,|$)\s*/
    const catList = categories[0].split(re)
    this.setState({
      activePost: item,
      activePostContent: item.metadata.NO_article,
      activePostImg: item.metadata.NO_img,
      activePostVideo: item.metadata.NO_video,
      catList,
    })
    toggleModalOverlay(true)
  }

  render() {
    const {
      activePost,
      activePostImg = false,
      activePostVideo = false,
      activePostContent = '',
    } = this.state
    const { cosmic, modalOpened, isMobile } = this.props
    const posts = (cosmic && cosmic.posts) || []
    let post = null
    const dynamicNum = Date.now() / 10000
    const radixPos = String(dynamicNum).indexOf('.') + 1
    const value = isMobile
      ? String(dynamicNum).slice(radixPos) * 0.5
      : String(dynamicNum).slice(radixPos) * 20
    post = posts.map((item) => {
      const style = {
        left: `${Math.floor((Math.random() * value) + 1)}px`,
        right: `${Math.floor((Math.random() * value) + 1)}px`,
        top: `${Math.floor((Math.random() * value) + 1)}px`,
        bottom: `${Math.floor((Math.random() * value) + 1)}px`,
      }
      const fontFamily = `NO__font--${item.metadata.NO_font_family}`
      const fontSize = `NO__font-size--${item.metadata.NO_font_size}`
      const titleClassNames = `NO__text NO__text-title ${fontFamily} ${fontSize}`
      return (
        /* eslint-disable-next-line */
        <div key={item._id} onClick={() => this.displayModal(item)} role='presentation'>
          <p className={titleClassNames} style={style}>{item.title}</p>
        </div>
      )
    })

    return (
      <div className='NO__post'>
        {/* eslint-disable-next-line */}
        {!modalOpened && !activePost._id && post}
        {/* eslint-disable-next-line */}
        {!!activePost._id && modalOpened
          && (
            <Post
              activePost={activePost}
              activePostImg={activePostImg}
              activePostVideo={activePostVideo}
              activePostContent={activePostContent}
              showSimilarPost={this.showSimilarPost}
              isMobile={isMobile}
            />
          )}
      </div>
    )
  }
}

export default Posts
