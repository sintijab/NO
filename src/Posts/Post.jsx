import React from 'react';
import LazyImage from '../images/LazyImage.js';


class Post extends React.Component {
  render() {
    const { activePost, showSimilarPost, activePostImg, activePostVideo, activePostContent } = this.props;
    if (activePost) {
      return (
        <div key={activePost._id} onClick={showSimilarPost} className="NO__post" >
         {activePostImg && <LazyImage src={activePostImg} className='NO__overlay-img' />}
         {activePostVideo &&
           <iframe width="60%"
             height="100%"
             title="vid"
             className='NO__overlay-vid'
             src={activePostVideo}
             frameborder="0"
             allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
             allowFullScreen></iframe>}
         <h3 className='NO__text NO__paragraph NO__h3'>{activePost.title}<span></span></h3><br/>
         <p className='NO__text NO__paragraph'>{activePostContent}</p>
       </div>
     );
   }
  }
}
export default Post;
