import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import * as imgSrc from '../images/47571265_200436654226310_2774485183145967616_n.png'
import * as logoPost from '../images/logo.jpg'
import * as brokenWhite from '../images/broken_white.png'
import * as brokenBlack from '../images/broken_black.png'
import Posts from '../Posts/Posts'
import SignForm from '../SignForm/SignForm'
import PostForm from '../PostForm/PostForm'
import { signOutAction, signStatusAction } from '../actions/signActions.js'
import { LOGGED_IN, LOGGED_OUT } from "../actions/types"
import { hasChromeiOS } from '../functions.js'

const Cosmic = require('cosmicjs')({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9Ac3luNG55LmNvbSIsInBhc3N3b3JkIjoiMmU5YmE4MmQ5YTMwYjZkMzkxNDNhNDRiZDJiZmYyMTQiLCJpYXQiOjE1NzE0MTE2NTJ9.bVld9Hp_sukxhdFWvhXysHA90-62JeuRUDPUVvVQJAg',
})

class Welcome extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      postFeedOpened: false,
      showOverlay: false,
      postOverlayVisible: false,
      isMobile: null,
      videoSrc: null,
      showPreviewImg: true,
      chromeiOS: hasChromeiOS(),
      cosmic: null,
      uniquePostCategories: [],
      randNR: Math.floor((Math.random() * 4) + 1),
      activeHint: null,
      showActiveHint: false,
      modalOpened: false,
      verticalPos: 0,
      horizontalPos: 0,
    }

    this.openPostFeed = this.openPostFeed.bind(this)
    this.addPostOverlay = this.addPostOverlay.bind(this)
    this.signForm = this.signForm.bind(this)
    this.signOut = this.signOut.bind(this)
    this.closeOverlay = this.closeOverlay.bind(this)
    this.viewMode = this.viewMode.bind(this)
    this.no_submit = this.no_submit.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.hideVideo = this.hideVideo.bind(this)
    this.toggleModalOverlay = this.toggleModalOverlay.bind(this)
    this.handleScroll = this.handleScroll.bind(this)

    const _this = this
    axios.get(`https://api.cosmicjs.com/v1/c61d0730-8187-11e9-9862-534a432d9a60/objects`, {
      params: {
        type: 'posts',
        read_key: 'reQaGkJrqvDkpuyb45enU4kYd3PWhZHUihAD7CDeW7shE1rleO',
      } })
    .then(function(response) {
      if (!response.data.objects) {
        _this.setState({
          error: true,
          loading: false,
        })
      } else {
        const postCategories = response.data.objects.map(item => item.metadata.NO_category)
        let uniquePostCategories = []
        for (let i = 0; i < postCategories.length; i += 1) {
          if (uniquePostCategories.indexOf(postCategories[i]) === -1) {
            uniquePostCategories.push(postCategories[i])
          }
          i += 1
        }
        _this.setState({
          cosmic: {
            posts: response.data.objects,
          },
          uniquePostCategories: uniquePostCategories,
          loading: false,
        })
      }
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.props.signStatusAction()
    window.addEventListener("resize", this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    const isMobile = window.innerWidth < 1400
     this.setState({ isMobile: isMobile })
  }

  componentDidUpdate() {
    const { loggedIn, isMobile, cosmic, activeHint } = this.state
    if (this.props.signType === LOGGED_IN && !loggedIn) {
      this.setState({
        loggedIn: true,
      })
    } else if (this.props.signType === LOGGED_OUT && loggedIn) {
      this.setState({
        loggedIn: false,
      })
    }

    if (!isMobile && cosmic && !activeHint) {
      const randPostNr = Math.floor(Math.random() * (cosmic.posts.length - 1))
      this.setState({ activeHint: cosmic.posts[randPostNr] })
    }
  }

  openPostFeed() {
    this.setState({postFeedOpened: true })
  }

  addPostOverlay() {
    const { postOverlayVisible } = this.state
    this.setState({postOverlayVisible: !postOverlayVisible})
  }

  signForm() {
    const { showLoginOverlay } = this.state
      this.setState({showLoginOverlay: !showLoginOverlay})
  }

  signOut() {
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
    const { isMobile, modalOpened, cosmic } = this.state
    if(!isMobile && !modalOpened) {
      const randPostNr = Math.floor(Math.random() * (cosmic.posts.length - 1))
      this.setState({ activeHint: cosmic.posts[randPostNr] })
      this.setState({ showActiveHint: true })
    } else if (!isMobile && modalOpened) {
      this.setState({ showActiveHint: false })
      this.toggleModalOverlay(false)
    }
    if (isMobile) {
      localStorage.removeItem('room')
      axios.get(`https://api.cosmicjs.com/v1/c61d0730-8187-11e9-9862-534a432d9a60/objects`, {
        params: {
          type: 'rooms',
          read_key: 'reQaGkJrqvDkpuyb45enU4kYd3PWhZHUihAD7CDeW7shE1rleO',
        } })
      .then(function(response) {
        if (!response.data.objects) {
          let randomRoomNumber = Math.floor(Math.random() * 400000000) + 1

          localStorage.setItem('room', randomRoomNumber)
          window.loadSimpleWebRTC()
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
            .then(data => {
              console.log(data)
              const bucket = Cosmic.bucket({
                slug: data.buckets[0].slug,
                write_key: '',
              })

            bucket.addObject(params)
            .then(data => {
              console.log(data)
              const roomNrText = document.getElementById("roomNr")
              roomNrText.innerHTML = randomRoomNumber
            })
            .catch(err => {
              console.log(err)
            })
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          const objects = response.data.objects
          const roomNr = (objects.length && objects.length) ? objects.map(object => object.metadata.room_id) : null
          const roomId = (objects.length && objects.length) ? objects.map(object => object.slug) : null
          if (roomNr.length) {
            let randNr = Math.floor(Math.random() * (roomNr.length - 1)) + 0
            let randomRoomNumber = roomNr[randNr]
          localStorage.setItem('room', randomRoomNumber)
          window.loadSimpleWebRTC()
          Cosmic.getBuckets()
          .then(data => {
            const bucket = Cosmic.bucket({
              slug: data.buckets[0].slug,
              write_key: '',
            })
            bucket.deleteObject({
              slug: roomId[randNr],
            })
            .then(data => {
              console.log(data)
              const roomNrText = document.getElementById("roomNr")
              roomNrText.innerHTML = randomRoomNumber
            })
            .catch(err => {
              console.log(err)
            })
          })
        }
        }
      })
      .catch(function(error) {
        console.log(error)
      })
    }
  }

  no_submit() {
    this.addPostOverlay()
    alert("Thank you! Your post has been submitted succesfully. It will be reviewed and published soon!") // eslint-disable-line no-alert
  }

  hideVideo() {
    const { randNR, chromeiOS } = this.state
      this.setState({showPreviewImg: false, postFeedOpened: true})
      let room = localStorage.getItem('room')
      if(!room) {
        room = Math.floor(Math.random() * 400000000) + 1
      }
      localStorage.setItem('room', room)
      window.loadSimpleWebRTC()
      if ((randNR === 2 || randNR === 3) && !chromeiOS) {
        window.loadSimpleWebRTC()
      } else if (!chromeiOS && randNR === 4){
        this.viewMode()
      } else {
        this.viewMode()
      }
  }

  handleScroll() {
    const srollVerticalReach = window.root.getBoundingClientRect().top < this.state.verticalPos
    const scrollHorizontalReach = window.root.getBoundingClientRect().left < this.state.horizontalPos
    const scrollVerticalTop = window.root.getBoundingClientRect().top === 0
    const scrollHorizontalTop = window.root.getBoundingClientRect().left === 0

    if (srollVerticalReach || scrollHorizontalReach || (scrollVerticalTop && scrollHorizontalTop)) {
      //set the color
      const randColorNr = Math.floor(Math.random() * 7)
      const bgColors = [
        "#FFFF00",
        "#000000",
        "#0000FF",
        "#00E8F7",
        "#5F00BA",
        "#FF00E9",
        "#FFEA84",
      ]
      const randColor = bgColors[randColorNr]
      document.body.style.backgroundColor = randColor
      //set the next frames
      const currVerticalPos = window.root.getBoundingClientRect().top
      const currHorizontalPos= window.root.getBoundingClientRect().left
      const currVerticalPosMin = currVerticalPos + 3200
      const currHorizontalPosMin = currHorizontalPos - 6632
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
    const { postFeedOpened, showLoginOverlay, loggedIn, postOverlayVisible, isMobile, cosmic, uniquePostCategories, activeHint, showActiveHint, modalOpened } = this.state

    const imgClassName = `NO__welcome_img ${!isMobile && (!postFeedOpened ? 'NO__welcome_img-show' : 'NO__welcome_img-hide')} ${isMobile && 'NO__welcome_img-show NO__welcome_img-mobile'}`
    const postView = (
      <div className='NO__feed'>
        <img className='NO__dot' src={logoPost} onClick={this.viewMode} id="dot"/>
        {isMobile && <span id="roomNr" className="NO_roomId"></span>}
          <Posts activeHint={activeHint} showActiveHint={showActiveHint} cosmic={cosmic} toggleModalOverlay={this.toggleModalOverlay} modalOpened={modalOpened} />
      </div>
    )

      if (isMobile) {
      var facingMode = "user"
      var constraints = { // eslint-disable-line no-unused-vars
        audio: false,
        video: {
         facingMode: facingMode,
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


      const noWelcomeClass = isMobile && !postFeedOpened && !(this.refs.video && this.refs.video.srcObject) ? 'NO__welcome-black' : 'NO__welcome'  // eslint-disable-line react/no-string-refs
      return (
        <div>
          <div className={noWelcomeClass} id="welcome">
          {!isMobile && <video autoPlay={true} ref="video" className="NO_vid" playsInline/> /* eslint-disable-line react/no-string-refs*/ }
          {postFeedOpened && postView}
            {isMobile &&
              <div className='NO__welcome-preview' onClick={this.hideVideo} >
                <img alt='NOIMAGE' src={welcomeImgSrc} className={imgClassName}/>
              </div>}
            {isMobile && <div id="remotes" className="row">
              {<div className="col-md-6 ">
                <div className="videoContainer" id="videoContainer">
                  <video id="selfVideo" onContextMenu={()=> {return false} } muted playsInline controls={true}></video>
                  <meter id="localVolume" className="volume" min="-45" max="-20" high="-25" low="-40"></meter>
                </div>
              </div>}
            </div>}
            {loggedIn && !isMobile &&
              <div className="NO__welcome-text NO__text">
                <span>Welcome @admin  | </span><span onClick={this.addPostOverlay}>ADD POST</span>
              </div>}
            {showLoginOverlay && !postFeedOpened && <SignForm closeOverlay={this.closeOverlay}/>}
            {postOverlayVisible && !postFeedOpened && loggedIn && <PostForm submit={this.no_submit} uniquePostCategories={uniquePostCategories}/>}
            {!isMobile && <img alt='NOIMAGE' src={welcomeImgSrc} className={imgClassName} onClick={this.openPostFeed} />}
            {!loggedIn && !isMobile && !postFeedOpened && <p className='NO_login NO__text' onClick={this.signForm}>Login</p>}
            {loggedIn && !isMobile && !postFeedOpened && <p className='NO_login NO__text' onClick={this.signOut}>Logout</p>}
          </div>
        </div>
      )
    }
  }

  const mapStateToProps = state => ({
    signType: state.signInStatus.type,
  })
export default connect(mapStateToProps, { signOutAction, signStatusAction })(Welcome)
