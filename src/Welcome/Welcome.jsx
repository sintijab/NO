import React from 'react';
import { connect } from 'react-redux';
import * as imgSrc from '../images/47571265_200436654226310_2774485183145967616_n.png';
import * as brokenWhite from '../images/broken_white.png';
import * as brokenBlack from '../images/broken_black.png';
import Posts from '../Posts/Posts';
import SignForm from '../SignForm/SignForm';
import PostForm from '../PostForm/PostForm';
import { signOutAction, signStatusAction } from '../actions/signActions.js';
import { LOGGED_IN, LOGGED_OUT } from "../actions/types"
import { chgBodyColor } from '../functions.js';

class Welcome extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      postFeedOpened: false,
      showOverlay: false,
      bodyVisible: false,
      postOverlayVisible: false,
      showPreview: true,
      isMobile: null,
      videoSrc: null,
      showPreviewImg: true
    }

    this.openPostFeed = this.openPostFeed.bind(this);
    this.addPostOverlay = this.addPostOverlay.bind(this);
    this.signForm = this.signForm.bind(this);
    this.signOut = this.signOut.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);
    this.viewMode = this.viewMode.bind(this);
    this.no_submit = this.no_submit.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.hideVideo = this.hideVideo.bind(this);
  }

  componentDidMount() {
    this.props.signStatusAction();
    window.addEventListener("resize", this.updateWindowDimensions());
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const isMobile = window.innerWidth < 1400;
     this.setState({ isMobile: isMobile });
  }

  componentDidUpdate() {
    const { loggedIn } = this.state;
    if (this.props.signType === LOGGED_IN && !loggedIn) {
      this.setState({
        loggedIn: true,
      });
    } else if (this.props.signType === LOGGED_OUT && loggedIn) {
      this.setState({
        loggedIn: false,
      });
    }
  }

  openPostFeed() {
    this.setState({postFeedOpened: true });
  }

  addPostOverlay() {
    const { postOverlayVisible } = this.state;
    this.setState({postOverlayVisible: !postOverlayVisible});
  }

  signForm() {
    const { showLoginOverlay } = this.state;
      this.setState({showLoginOverlay: !showLoginOverlay})
  }

  signOut() {
    this.props.signOutAction();
    this.setState({
      loggedIn: false,
    })
  }

  closeOverlay() {
    const { showLoginOverlay } = this.state;
      this.setState({
        showLoginOverlay: !showLoginOverlay,
    })
  }

  viewMode() {
    const { bodyVisible } = this.state;
    this.setState({ bodyVisible: !bodyVisible });
    if (bodyVisible) {
      chgBodyColor('#000000');
    } else {
      chgBodyColor('#ffffff');
    }
  }

  no_submit(formSubmitted = false) {
    this.addPostOverlay();
    alert("Thank you! Your post has been submitted succesfully. It will be reviewed and published soon!");
  }

  hideVideo() {
      this.setState({showPreviewImg: false});
  }


  render() {
    const { postFeedOpened, showLoginOverlay, loggedIn, postOverlayVisible, showPreview, showPreviewImg, isMobile } = this.state;
    const imgClassName = `NO__welcome_img ${!postFeedOpened ? 'NO__welcome_img-show' : 'NO__welcome_img-hide'} ${isMobile && 'NO__welcome_img-mobile'}`;

    const postView = (
      <div className='NO__feed'>
        <span className='NO__dot' onClick={this.viewMode}></span>
          <Posts />
      </div>
    );
    const prewiewShown = !!sessionStorage.getItem('preview');
    if(!prewiewShown && !isMobile) {
        setTimeout(
          function() {
              this.setState({showPreview: false});
              sessionStorage.setItem('preview', 'true');
          }
          .bind(this),
          8500
        );
      } else if (showPreview) {
        this.setState({showPreview: false});
      }

      if (isMobile) {
      var facingMode = "user";
      var constraints = {
        audio: false,
        video: {
         facingMode: facingMode
        }
      }
    }
      let welcomeImgSrc = imgSrc;
      if (isMobile) {
        if (this.refs.video && this.refs.video.srcObject) {
          welcomeImgSrc = brokenBlack;
        } else {
          welcomeImgSrc = brokenWhite;
        }
      }


      const noWelcomeClass = isMobile && !postFeedOpened && !(this.refs.video && this.refs.video.srcObject) ? 'NO__welcome-black' : 'NO__welcome';

      return (
        <div>
          <div className={noWelcomeClass}>
          {isMobile && <video autoPlay={true} ref="video" className="NO_vid" playsInline/>}
          {showPreview && !isMobile &&
            <div>
              <div className='NO__welcome-preview'/>
                <div className="fb-video"
                  data-href="https://www.facebook.com/NOprojekt/videos/1127787447404230/"
                  data-height="1000"
                  data-autoplay
                  data-allowfullscreen="true"
                  ref="wVideo">
                </div>
            </div>}
            {isMobile && showPreviewImg &&
              <div className='NO__welcome-preview' onClick={document.init}>
                <img alt='NOIMAGE' src={welcomeImgSrc} className={imgClassName} onClick={this.hideVideo} />
              </div>}
            {loggedIn && !isMobile &&
              <div className="NO__welcome-text NO__text">
                <span>Welcome @admin  | </span><span onClick={this.addPostOverlay}>ADD POST</span>
              </div>}
            {showLoginOverlay && !postFeedOpened && <SignForm closeOverlay={this.closeOverlay}/>}
            {postOverlayVisible && !postFeedOpened && loggedIn && <PostForm submit={this.no_submit}/>}
            <img alt='NOIMAGE' src={welcomeImgSrc} className={imgClassName} onClick={this.openPostFeed} />
            {!loggedIn && !isMobile && <p className='NO_login NO__text' onClick={this.signForm}>Login</p>}
            {loggedIn && !isMobile && <p className='NO_login NO__text' onClick={this.signOut}>Logout</p>}
          </div>
          {postFeedOpened && postView}
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    signType: state.signInStatus.type,
  })
export default connect(mapStateToProps, { signOutAction, signStatusAction })(Welcome);
