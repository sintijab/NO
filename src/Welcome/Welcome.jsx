/* eslint react/prop-types: 0 */
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
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
import { LOGGED_IN, LOGGED_OUT } from '../actions/types'
import { hasChromeiOS, getCookie } from '../functions'

const Cosmic = require('cosmicjs')({
  token: getCookie('val'), // optional
})

class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      postFeedOpened: false,
      postOverlayVisible: false,
      isMobile: window.innerWidth < 800,
      chromeiOS: hasChromeiOS(),
      cosmic: null,
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
    this.mobileSec = this.mobileSec.bind(this)
    this.connectRoom = this.connectRoom.bind(this)
    this.selector = React.createRef()

    const _this = this
    axios.get(`https://api.cosmicjs.com/v1/${process.env.BUCKET_ID}/objects`, {
      params: {
        type: 'posts',
        read_key: process.env.READ_KEY,
      },
    })
      .then((response) => {
        if (!response.data.objects) {
          _this.setState({
            error: true,
            loading: false,
          })
        } else {
          const postCategories = response.data.objects.map((item) => item.metadata.NO_category)
          // eslint-disable-next-line
          let uniqueCategories = []
          for (let i = 0; i < postCategories.length; i += 1) {
            if (uniqueCategories.indexOf(postCategories[i]) === -1) {
              uniqueCategories.push(postCategories[i])
            }
            i += 1
          }
          _this.setState({
            cosmic: {
              posts: response.data.objects,
              uniqueCategories,
              loading: false,
            },
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.props.signStatusAction()
    window.addEventListener('resize', this.updateWindowDimensions)

    if (window.location.href.indexOf('about') > -1) {
      this.setState({ displayPageDetails: true })
    }
    if (window.location.href.indexOf('00000') > -1) {
      this.setState({ postFeedOpened: true })
      if (window.innerWidth < 800) {
        this.connectRoom()
      }
      if (window.innerWidth > 800) {
        window.addEventListener('scroll', this.handleScroll)
      }
    }
  }

  componentDidUpdate() {
    const {
      loggedIn,
      isMobile,
      cosmic,
      activeHint,
    } = this.state
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

    if (!isMobile && cosmic && !activeHint) {
      const postsIndexLength = cosmic.posts.length - 1
      const randPostNr = Math.floor(Math.random() * (postsIndexLength - 0 + 1))
      // eslint-disable-next-line
      this.setState({ activeHint: cosmic.posts[randPostNr] })
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

  connectRoom() {
    const { displayPostHint } = this.state
    this.setState({ displayPostHint: !displayPostHint })
    if (localStorage.getItem('room')) {
      localStorage.removeItem('room')
    }
    // eslint-disable-next-line
    let response = null
    axios.get(`https://api.cosmicjs.com/v1/${process.env.BUCKET_ID}/objects?type=rooms&read_key=${process.env.READ_KEY}`)
      .then((res) => {
        if (res.data.objects) {
          response = true
        }
      })
      .catch((error) => {
        console.log(error)
      })
    if (!response) {
      const randomRoomNumber = Math.floor(Math.random() * 400000000) + 1

      localStorage.setItem('room', randomRoomNumber)
      // eslint-disable-next-line
      loadSimpleWebRTC()
      const params = {
        title: 'room_id',
        type_slug: 'rooms',
        slug: randomRoomNumber,
        content: '',
        status: 'published',
        metafields: [
          {
            required: true,
            value: randomRoomNumber,
            key: 'room_id',
            title: 'room_id',
            type: 'text',
            children: null,
          },
        ],
      }
      Cosmic.getBuckets()
        .then((data) => {
          console.log(data)
          const bucket = Cosmic.bucket({
            slug: data.buckets[0].slug,
            write_key: process.env.WRITE_KEY,
          })

          bucket.addObject(params)
            .then((res) => {
              console.log(res)
              const roomNrText = document.getElementById('roomNr')
              roomNrText.innerHTML = randomRoomNumber
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      // eslint-disable-next-line
      const objects = response.data.objects
      const roomNr = (objects.length && objects.length)
        ? objects.map((object) => object.metadata.room_id) : null
      const roomId = (objects.length && objects.length) ? objects.map((object) => object.slug) : null
      if (roomNr.length) {
        const randNr = Math.floor(Math.random() * (roomNr.length - 1)) + 0
        const randomRoomNumber = roomNr[randNr]
        localStorage.setItem('room', randomRoomNumber)
        // eslint-disable-next-line
        loadSimpleWebRTC()
        Cosmic.getBuckets()
          .then((data) => {
            const bucket = Cosmic.bucket({
              slug: data.buckets[0].slug,
              write_key: process.env.WRITE_KEY,
            })
            bucket.deleteObject({
              slug: roomId[randNr],
            })
              .then((res) => {
                console.log(res)
                const roomNrText = document.getElementById('roomNr')
                roomNrText.innerHTML = randomRoomNumber
              })
              .catch((err) => {
                console.log(err)
              })
          })
      }
    }
  }


  viewMode() {
    const { modalOpened, cosmic, displayPostHint } = this.state
    if (!modalOpened && cosmic) {
      const postsIndexLength = cosmic.posts.length - 1
      const randPostNr = Math.floor(Math.random() * (postsIndexLength - 0 + 1))
      this.setState({
        activeHint: cosmic.posts[randPostNr],
        showActiveHint: true,
      })
    } else if (modalOpened && cosmic) {
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

  mobileSec() {
    const { displayPageDetails } = this.state
    this.setState({ displayPageDetails: !displayPageDetails })
  }

  render() {
    const {
      postFeedOpened,
      showLoginOverlay,
      loggedIn,
      postOverlayVisible,
      isMobile,
      cosmic,
      activeHint,
      showActiveHint,
      modalOpened,
      displayPageDetails,
      welcomePage,
    } = this.state

    const imgMobileClass = 'NO__welcome_img-show NO__welcome_img-mobile '
    const postFeedClass = !postFeedOpened ? 'NO__welcome_img-show' : 'NO__welcome_img-hide'
    const imgClassName = `NO__welcome_img ${!isMobile && postFeedClass} ${isMobile && imgMobileClass}`
    const postView = (
      <div className='NO__feed' ref={this.selector}>
        <div onClick={this.viewMode} id='callButton' onKeyDown={this.viewMode} role='presentation'>
          <img className='NO__dot' alt='NO__dot' src={menuIcon} />
        </div>
        <a href='about' onClick={() => this.mobileSec}>
          <img className='NO__dot NO__about' alt='NO__about' src={imgAboutSrc} />
        </a>
        {/* eslint-disable-next-line */}
        {isMobile && <span id='roomNr' className='NO_roomId'></span>}
        <Posts
          activeHint={activeHint}
          showActiveHint={showActiveHint}
          cosmic={cosmic}
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
                uniquePostCategories={cosmic.uniqueCategories || []}
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
})
export default connect(mapStateToProps, { signOutAction, signStatusAction })(Welcome)
