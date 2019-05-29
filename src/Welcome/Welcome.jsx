import React from 'react';
import * as imgSrc from '../images/47571265_200436654226310_2774485183145967616_n.png';
import Posts from '../Posts/Posts';

class Welcome extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      postFeedOpened: false
    }

    this.openPostFeed = this.openPostFeed.bind(this);
  }

  openPostFeed() {
    const { postFeedOpened } = this.state;
    this.setState({postFeedOpened: !postFeedOpened});
  }

  render() {
    const { postFeedOpened } = this.state;
    const imgClassName = `NO__welcome_img ${!postFeedOpened ? 'NO__welcome_img-show' : 'NO__welcome_img-hide'}`;

      return (
        <div className='NO__welcome'>
          {!postFeedOpened &&
            <img alt='NOIMAGE' src={imgSrc} className={imgClassName} onClick={this.openPostFeed}/>}
          {postFeedOpened && <Posts />}
        </div>
      );
    }
  }

export default Welcome;
