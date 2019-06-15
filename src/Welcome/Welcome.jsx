import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as imgSrc from '../images/47571265_200436654226310_2774485183145967616_n.png';
import * as brokenWhite from '../images/broken_white.png';
import * as brokenBlack from '../images/broken_black.png';
import Posts from '../Posts/Posts';
import SignForm from '../SignForm/SignForm';
import PostForm from '../PostForm/PostForm';
import { signOutAction, signStatusAction } from '../actions/signActions.js';
import { LOGGED_IN, LOGGED_OUT } from "../actions/types"
import { chgBodyColor } from '../functions.js';
import { getCookie } from '../functions.js';

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
      showPreviewImg: true,
      roomNumber: null,
      rooms: [{roomNr: null, roomId: null}],
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
    this.getRandomRoomNumber = this.getRandomRoomNumber.bind(this);

    const _this = this;
    axios.get(`https://api.cosmicjs.com/v1/c61d0730-8187-11e9-9862-534a432d9a60/objects`, {
      params: {
        type: 'rooms'
      } })
    .then(function (response) {
      if (!response.data.objects) {
        _this.setState({
          error: true,
          loading: false
        })
      } else {
        const objects = response.data.objects;
        const roomNr = (objects.length && objects.length) ? objects.map(object => object.metadata.room_id) : null;
        const roomId = (objects.length && objects.length) ? objects.map(object => object.slug) : null;
        _this.setState({
          rooms: {roomNr: roomNr, roomId: roomId},
          loading: false
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
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
    const { rooms } = this.state;
    if (rooms && rooms.roomNr && rooms.roomId) {
    const existingNr = localStorage.getItem('room');
    const existingRoomIndex = existingNr ? rooms.roomNr.indexOf(room => room === existingNr) : null;
    if (existingRoomIndex && existingRoomIndex !== -1) {
        const existingRoomId = existingRoomIndex ? rooms.roomId[existingRoomIndex] : null;
        if (existingRoomId) {
        const Cosmic = require('cosmicjs')({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9Ac3luNG55LmNvbSIsInBhc3N3b3JkIjoiMmU5YmE4MmQ5YTMwYjZkMzkxNDNhNDRiZDJiZmYyMTQiLCJpYXQiOjE1NjA1NTI4MzF9.12JEhTvZyDQA3pcQYpyLruKUMao1PRyrlPFPbhaUw3o'
        })
        const bucket = Cosmic.bucket({
        slug: existingRoomId,
        write_key: ''
      })
      bucket
      .deleteObject({
        slug: 'cosmic-js-example'
      })
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
      }
      this.setState({
        rooms: {
          roomNr: rooms.roomNr.slice(existingRoomIndex, 1),
          roomId: rooms.roomId.slice(existingRoomIndex, 1)
        }
      })
      localStorage.removeItem('room');
    }
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

  getRandomRoomNumber() {
    const { rooms = [] } = this.state;
    for (var i=0; i<= rooms.roomNr.length; i++) {
      let randomNum = Math.floor(Math.random() * 400000000) + 1;
      if(rooms.roomNr[i] !== randomNum) {
        return randomNum;
      }
      i++;
    }
    return;
  }

  viewMode() {
    const { bodyVisible, isMobile, rooms } = this.state;
    if (!isMobile) {
      this.setState({ bodyVisible: !bodyVisible });
      if (bodyVisible) {
        chgBodyColor('#000000');
      } else {
        chgBodyColor('#ffffff');
      }
    } else {
      const existingNr = localStorage.getItem('room');
      if (existingNr) {
        localStorage.removeItem('room');
      }
      let randomRoomNumber = this.getRandomRoomNumber();
      if (rooms.roomNr.length) {
        const randNr = Math.floor(Math.random() * rooms.roomNr.length) + 1;
        randomRoomNumber = rooms.roomNr[randNr];
      }
      if (randomRoomNumber) {
      localStorage.setItem('room', randomRoomNumber);
      this.setState({ roomNumber: randomRoomNumber });
        const params = {
          title: 'room_id',
          type_slug: 'rooms',
          content: '',
          status: 'published',
          metafields: [
            {
              required: true,
              value: randomRoomNumber,
              key: 'room_id',
              title: 'room_id',
              type: 'text',
              children: null
            },
          ],
        }
        const Cosmic = require('cosmicjs')({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9Ac3luNG55LmNvbSIsInBhc3N3b3JkIjoiMmU5YmE4MmQ5YTMwYjZkMzkxNDNhNDRiZDJiZmYyMTQiLCJpYXQiOjE1NjA1NTI4MzF9.12JEhTvZyDQA3pcQYpyLruKUMao1PRyrlPFPbhaUw3o'
        })
        Cosmic.getBuckets()
        .then(data => {
          console.log(data)
          const bucket = Cosmic.bucket({
            slug: data.buckets[0].slug,
            write_key: ''
          })

        bucket.addObject(params)
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
        })
        .catch(err => {
          console.log(err)
        })
      }
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
    const { postFeedOpened, showLoginOverlay, loggedIn, postOverlayVisible, showPreview, showPreviewImg, isMobile, roomNumber } = this.state;
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
          {!isMobile && <video autoPlay={true} ref="video" className="NO_vid" playsInline/>}
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
            {isMobile && <div id="remotes" className="row">
              {<div className="col-md-6 ">
                <div className="videoContainer" id="videoContainer">
                  <video id="selfVideo" onContextMenu="return false;"></video>
                  <meter id="localVolume" className="volume" min="-45" max="-20" high="-25" low="-40"></meter>
                </div>
              </div>}
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
