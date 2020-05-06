/* eslint react/prop-types: 0 */
import React from 'react'
import { connect } from 'react-redux'
import imgSrc from '../images/47571265_200436654226310_2774485183145967616_n.png'
import imgAboutSrc from '../images/68476430_608275159696277_7376439703328784384_o.png'
import noLogoImgSrc from '../images/no_logo.png'
import menuIcon from '../images/menu_png.png'
import brokenWhite from '../images/broken_white.png'
import brokenBlack from '../images/broken_black.png'
import Posts from '../Posts/Posts'
import SignForm from '../SignForm/SignForm'
import PostForm from '../PostForm/PostForm'
import { signOutAction, signStatusAction } from '../actions/signActions'
import fetchContent from '../actions/postActions'
import { LOGGED_IN, LOGGED_OUT } from '../actions/types'
import { hasChromeiOS } from '../functions'
import { selectUniqueCategories, selectFieldValue } from '../selectors'
import connectWithRoom from './connect'

class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      postFeedOpened: false,
      postOverlayVisible: false,
      isMobile: window.innerWidth < 800,
      chromeiOS: hasChromeiOS(),
      randNR: Math.floor((Math.random() * 4) + 1),
      activeHint: null,
      showActiveHint: false,
      modalOpened: false,
      verticalPos: 0,
      horizontalPos: 0,
      displayPageDetails: false,
      displayPostHint: false,
      welcomePage: false,
    }

    this.openPostFeed = this.openPostFeed.bind(this)
    this.addPostOverlay = this.addPostOverlay.bind(this)
    this.signForm = this.signForm.bind(this)
    this.signOut = this.signOut.bind(this)
    this.closeOverlay = this.closeOverlay.bind(this)
    this.viewMode = this.viewMode.bind(this)
    this.noSubmit = this.noSubmit.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.hideVideo = this.hideVideo.bind(this)
    this.toggleModalOverlay = this.toggleModalOverlay.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.selector = React.createRef()
  }

  componentDidMount() {
    // eslint-disable-next-line
    const { signStatusAction, fetchContent } = this.props
    const { displayPostHint } = this.state
    signStatusAction()
    window.addEventListener('resize', this.updateWindowDimensions)
    if (window.location.href.indexOf('about') > -1) {
      this.setState({ displayPageDetails: true })
    }
    if (window.location.href.indexOf('00000') > -1) {
      this.setState({ postFeedOpened: true })
      if (window.innerWidth < 800) {
        this.setState({ displayPostHint: !displayPostHint })
        connectWithRoom()
      }
      if (window.innerWidth > 800) {
        window.addEventListener('scroll', this.handleScroll)
      }
    }
    fetchContent('fields')
    fetchContent('posts')
  }

  componentDidUpdate() {
    const {
      loggedIn,
      isMobile,
      activeHint,
    } = this.state
    const { posts } = this.props
    const { signType } = this.props
    if (signType === LOGGED_IN && !loggedIn) {
      // eslint-disable-next-line
      this.setState({
        loggedIn: true,
      })
    } else if (signType === LOGGED_OUT && loggedIn) {
      // eslint-disable-next-line
      this.setState({
        loggedIn: false,
      })
    }

    if (!isMobile && posts && posts.length && !activeHint) {
      const postsIndexLength = posts.length - 1
      const randPostNr = Math.floor(Math.random() * (postsIndexLength - 0 + 1))
      // eslint-disable-next-line
      this.setState({ activeHint: posts[randPostNr] })
    }
  }

  componentWillUnmount() {
    if (window.innerWidth > 800) {
      window.removeEventListener('scroll', this.handleScroll)
    }
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    const isMobile = window.innerWidth < 800
    this.setState({ isMobile })
  }

  openPostFeed() {
    this.setState({ postFeedOpened: true })
    if (window.innerWidth > 800) {
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  addPostOverlay() {
    const { postOverlayVisible } = this.state
    this.setState({ postOverlayVisible: !postOverlayVisible })
  }

  signForm() {
    const { showLoginOverlay } = this.state
    this.setState({ showLoginOverlay: !showLoginOverlay })
  }

  signOut() {
    // eslint-disable-next-line
    this.props.signOutAction()
    this.setState({
      loggedIn: false,
    })
  }

  closeOverlay() {
    const { showLoginOverlay } = this.state
    this.setState({
      showLoginOverlay: !showLoginOverlay,
    })
  }

  toggleModalOverlay(state = false, hideActiveHint = false) {
    this.setState({ modalOpened: state })
    if (hideActiveHint) {
      this.setState({ showActiveHint: false })
    }
  }

  viewMode() {
    const { modalOpened, displayPostHint } = this.state
    const { posts } = this.props
    if (!modalOpened && posts) {
      const postsIndexLength = posts.length - 1
      const randPostNr = Math.floor(Math.random() * (postsIndexLength - 0 + 1))
      this.setState({
        activeHint: posts[randPostNr],
        showActiveHint: true,
      })
    } else if (modalOpened && posts) {
      this.setState({
        showActiveHint: false,
        displayPostHint: !displayPostHint,
      })
      this.toggleModalOverlay(false)
    }
  }

  noSubmit() {
    this.addPostOverlay()
    alert('post has been submitted, it will be reviewed and published soon!') // eslint-disable-line no-alert
  }

  hideVideo(e) {
    e.preventDefault()
    const { randNR, chromeiOS } = this.state
    this.setState({ postFeedOpened: true })
    let room = localStorage.getItem('room')
    if (!room) {
      room = Math.floor(Math.random() * 400000000) + 1
    }
    localStorage.setItem('room', room)
    // eslint-disable-next-line
    loadSimpleWebRTC()
    if ((randNR === 2 || randNR === 3) && !chromeiOS) {
      // eslint-disable-next-line
      loadSimpleWebRTC()
    } else if (!chromeiOS && randNR === 4) {
      this.viewMode()
    } else {
      this.viewMode()
    }
  }

  handleScroll() {
    const { verticalPos, horizontalPos } = this.state
    const srollVerticalReach = this.selector.current.getBoundingClientRect().top < verticalPos
    const scrollHorizontalReach = this.selector.current.getBoundingClientRect().left < horizontalPos
    const scrollVerticalTop = this.selector.current.getBoundingClientRect().top === 0
    const scrollHorizontalTop = this.selector.current.getBoundingClientRect().left === 0

    if (srollVerticalReach || scrollHorizontalReach || (scrollVerticalTop && scrollHorizontalTop)) {
      // set the color
      const randColorNr = Math.floor(Math.random() * (11 - 0 + 1))
      const bgColors = [
        'hsla(0,0%,100%,1)',
        'hsla(60,100%,50%,1)',
        'hsla(0,0%,0%,1)',
        'hsla(0,0%,100%,1)',
        'hsla(240,100%,50%,1)',
        'hsla(184,100%,48%,1)',
        'hsla(0,0%,100%,1)',
        'hsla(271,100%,36%,1)',
        'hsla(305,100%,50%,1)',
        'hsla(0,0%,100%,1)',
        'hsla(50,100%,76%,1)',
        'hsla(0,0%,100%,1)',
      ]
      const randColor = bgColors[randColorNr]
      // const randTextColor = bgTextColors[randColorNr]
      document.body.style.backgroundColor = randColor
      // document.body.style.color = randTextColor
      // set the next frames
      const currVerticalPos = this.selector.current.getBoundingClientRect().top
      const currHorizontalPos = this.selector.current.getBoundingClientRect().left
      const currVerticalPosMin = verticalPos === 0 ? currVerticalPos : currVerticalPos + 3200
      const currHorizontalPosMin = horizontalPos === 0
        ? currHorizontalPos
        : currHorizontalPos + 6632
      const currVerticalPosMax = currVerticalPos - 3200
      const currHorizontalPosMax = currHorizontalPos - 6632
      const randVericalPos = Math.floor(Math.random() * (currVerticalPosMax - currVerticalPosMin + 1) + currVerticalPosMin)
      const randHorizontalPos = Math.floor(Math.random() * (currHorizontalPosMax - currHorizontalPosMin + 1) + currHorizontalPosMin)
      this.setState({
        verticalPos: randVericalPos,
        horizontalPos: randHorizontalPos,
      })
    }
  }

  render() {
    const {
      postFeedOpened,
      showLoginOverlay,
      loggedIn,
      postOverlayVisible,
      isMobile,
      activeHint,
      showActiveHint,
      modalOpened,
      displayPageDetails,
      welcomePage,
    } = this.state
    const { posts, uniqueCategories, indexDescription } = this.props

    const imgMobileClass = 'NO__welcome_img-show NO__welcome_img-mobile '
    const postFeedClass = !postFeedOpened ? 'NO__welcome_img-show' : 'NO__welcome_img-hide'
    const imgClassName = `NO__welcome_img ${!isMobile && postFeedClass} ${isMobile && imgMobileClass}`
    const postView = (
      <div className='NO__feed' ref={this.selector}>
        <div onClick={this.viewMode} id='callButton' onKeyDown={this.viewMode} role='presentation'>
          <img className='NO__dot' alt='NO__dot' src={imgAboutSrc} />
        </div>
        <a href='about' onClick={() => this.setState({ displayPageDetails: !displayPageDetails })}>
          <img className='NO__dot NO__about' alt='NO__about' src={menuIcon} />
        </a>
        {/* eslint-disable-next-line */}
        {isMobile && <span id='roomNr' className='NO_roomId'></span>}
        <Posts
          activeHint={activeHint}
          showActiveHint={showActiveHint}
          posts={posts}
          toggleModalOverlay={this.toggleModalOverlay}
          modalOpened={modalOpened}
          isMobile={isMobile}
        />
      </div>
    )

    if (isMobile) {
      // eslint-disable-next-line
      var facingMode = 'user'
      // eslint-disable-next-line
      var constraints = { // eslint-disable-line no-var
        audio: false,
        video: {
          facingMode,
        },
      }
    }
    let welcomeImgSrc = imgSrc
    if (isMobile) {
      if (this.refs.video && this.refs.video.srcObject) { // eslint-disable-line react/no-string-refs
        welcomeImgSrc = brokenBlack
      } else {
        welcomeImgSrc = brokenWhite
      }
    }


    const noWelcomeClass = isMobile && !displayPageDetails && !postFeedOpened
      && !(this.refs.video && this.refs.video.srcObject) ? 'NO__welcome-black' : 'NO__welcome' // eslint-disable-line react/no-string-refs
    return (
      <div>
        <div className={noWelcomeClass} id='startButton'>
          {!isMobile
            && <video autoPlay ref='video' className='NO_vid' playsInline muted /> /* eslint-disable-line react/no-string-refs */ }
          {postFeedOpened && postView}
          {postFeedOpened && (<div className='NO_descr' dangerouslySetInnerHTML={{__html: indexDescription }} />) /* eslint-disable-line */}
          {isMobile && !displayPageDetails
            && (
            <a className='NO__welcome-preview' onClick={this.hideVideo} href='/00000'>
              <img alt='NOIMAGE' src={welcomeImgSrc} className={imgClassName} />
            </a>
            )}
          {isMobile
            && (
              <div id='remotes' className='row'>
                <div className='col-md-6'>
                  <div className='videoContainer' id='videoContainer'>
                    {/* eslint-disable-next-line */}
                    <video
                      id='selfVideo'
                      onContextMenu={() => false}
                      muted
                      playsInline
                      controls
                    >
                    </video>
                    {/* eslint-disable-next-line */}
                    <meter id='localVolume' className='volume' min='-45' max='-20' high='-25' low='-40'></meter>
                  </div>
                </div>
              </div>
            )}
          {/* eslint-disable-next-line */}
          <video id='localVideo' playsInline autoPlay muted></video>
          {/* eslint-disable-next-line */}
          <video id='remoteVideo' playsInline autoPlay></video>
          {loggedIn && !isMobile
            && (
            <div className='NO__welcome-text NO__text'>
              <span>Welcome @admin  | </span>
              <span onClick={this.addPostOverlay} role='presentation'>ADD POST</span>
            </div>
            )}
          {showLoginOverlay && !postFeedOpened && <SignForm closeOverlay={this.closeOverlay} />}
          {postOverlayVisible && !postFeedOpened && loggedIn
            && (
              <PostForm
                submit={this.noSubmit}
                uniquePostCategories={uniqueCategories || []}
              />
            )}
          {!isMobile
            && (
              <div onClick={this.openPostFeed} onKeyDown={this.openPostFeed} role='presentation'>
                <img alt='NOIMAGE' src={welcomeImgSrc} className={imgClassName} />
              </div>
            )}
          {!isMobile && !welcomePage
            && (
              <div
                onClick={() => this.setState({ welcomePage: true })}
                onKeyDown={() => this.setState({ welcomePage: true })}
                role='presentation'
              >
                <img alt='NOIMAGE' src={noLogoImgSrc} className={imgClassName} style={{ height: '100vH' }} />
              </div>
            )}
          {!loggedIn && !isMobile && !postFeedOpened
            && (
              <div className='NO_login NO__text' onClick={this.signForm} role='presentation'>Login</div>
            )}
          {loggedIn && !isMobile && !postFeedOpened
            && (
              <div className='NO_login NO__text' onClick={this.signOut} role='presentation'>Logout</div>
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  signType: state.signInStatus.type,
  posts: state.postsData.posts,
  indexDescription: state.fieldsData.fields.length && selectFieldValue(state.fieldsData.fields, 'description'),
  uniqueCategories: selectUniqueCategories(state.postsData.posts),
})
const mapDispatchToProps = (dispatch) => ({
  signOutAction: () => dispatch(signOutAction),
  signStatusAction: () => dispatch(signStatusAction),
  fetchContent: (params) => dispatch(fetchContent(params)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
