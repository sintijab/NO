/* eslint react/prop-types: 0 */
import React from 'react'
import LazyImage from '../images/LazyImage'

const Post = (props) => {
  const {
    activePost,
    showSimilarPost,
    activePostImg,
    activePostVideo,
    activePostContent,
    isMobile,
  } = props
  if (activePost && isMobile) {
    return (
      /* eslint-disable-next-line */
      <div key={activePost._id} onClick={showSimilarPost} className='NO__post' role='presentation'>
        {activePostImg && <LazyImage src={activePostImg} className='NO__overlay-img' />}
        {activePostVideo
          && (
          <iframe
            width='60%'
            height='100%'
            title='vid'
            className='NO__overlay-vid'
            src={activePostVideo}
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
          )}
        <div className='NO__text'>
          <h3 className='NO__h3'>{activePost.title}</h3>
          <br />
          <p className='NO__paragraph'>{activePostContent}</p>
        </div>
      </div>
    )
  }
  if (activePost) {
    return (
      /* eslint-disable-next-line */
      <div key={activePost._id} onClick={showSimilarPost} className='NO__post' role='presentation'>
        {activePostImg
         && (
           <LazyImage src={activePostImg} className='NO__overlay-img' />
         )}
        {activePostVideo
          && (
            <iframe
              width='60%'
              height='100%'
              title='vid'
              className='NO__overlay-vid'
              src={activePostVideo}
              frameBorder='0'
              allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          )}
        <h3 className='NO__text NO__paragraph NO__h3'>{activePost.title}</h3>
        <br />
        <p className='NO__text NO__paragraph'>{activePostContent}</p>
      </div>
    )
  }
  return <div />
}
export default Post
