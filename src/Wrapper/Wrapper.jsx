/* eslint react/prop-types: 0 */
import React from 'react'
import { connect } from 'react-redux'

import { signInAction } from '../actions/signActions'
import {
  fetchSCCollection,
  getSCMusic,
  soundStartedAction,
  soundFinishedAction,
  setAudioSource,
} from '../actions/soundActions'
import { fetchContent } from '../actions/postActions'
import { selectUniqueCategories, selectFieldValue, mapSoundMetafields } from '../selectors'
import Welcome from '../Welcome/Welcome'
import About from '../About'
import noLogoImgSrc from '../images/no_logo.png'
import brokenWhite from '../images/broken_white.png'
import imgSrc from '../images/47571265_200436654226310_2774485183145967616_n.png'

import SC from '../sc'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSound: {
        url: null,
      },
      activeAuthorId: null,
      displayAboutSection: window.location.href.indexOf('about') > -1,
      displayPostView: false,
      welcomePage: false,
      previewSet: false,
      isMobile: window.innerWidth < 800,
    }

    this.setSoundSource = this.setSoundSource.bind(this)
    this.playNextSound = this.playNextSound.bind(this)
    this.displayPageDetails = this.displayPageDetails.bind(this)
    this.addSound = this.addSound.bind(this)
  }

  componentDidMount() {
    const { signIn, fetchContents } = this.props
    signIn()
    fetchContents('fields')
    fetchContents('posts')
    fetchContents('sounds')
    fetchContents('pages')
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      activeSound,
      activeAuthorId,
      welcomePage,
    } = this.state
    const {
      fetchSoundLinks,
      collection,
      scSounds,
      getMusicSC,
      sounds,
      isPlaying,
      audioSrc,
      isMobile,
    } = this.props
    if (!activeSound.url && sounds && sounds.length) {
      fetchSoundLinks(sounds[0])
      this.setState({ activeSound: { url: sounds[0] } }) // eslint-disable-line
    }
    // get tracks from author profile on sc
    if (collection && collection.length && collection[0].id !== activeAuthorId) {
      getMusicSC(collection[0].id)
      this.setState({ activeAuthorId: collection[0].id }) // eslint-disable-line
    }
    // play active sound from authors collection or fetch other profile to get active song
    if (scSounds && scSounds.length) {
      const activePlayer = scSounds.filter((player) => player.permalink_url === activeSound.url)
      if (!activePlayer.length && activeSound.url && (!activeSound.url || (prevState.activeSound.url !== activeSound.url))) {
        fetchSoundLinks(activeSound.url)
      }
    }
    if (((prevProps.scSounds !== scSounds)
      || (prevState.activeSound.url && prevState.activeSound.url !== activeSound.url)
      || (prevState.welcomePage && prevState.welcomePage !== welcomePage)) && !isPlaying) {
      const activePlayer = !!scSounds && scSounds.filter((player) => player.permalink_url === activeSound.url)
      if (activePlayer.length) {
        this.setSoundSource(activePlayer[0])
      } else {
        fetchSoundLinks(activeSound.url)
      }
    }
    if ((prevProps.audioSrc && prevProps.audioSrc !== audioSrc) || (welcomePage && !prevProps.audioSrc && !isMobile)) {
      const player = document.getElementById('noAudio')
      player.src = audioSrc
      player.addEventListener('ended', () => this.playNextSound)
      player.play()
    }
  }

  setSoundSource(activePlayer) {
    const { setAudioSrc } = this.props
    try {
      SC.stream(`${activePlayer.id}`).then((url) => {
        setAudioSrc(url)
      })
    } catch (err) {
      console.error(err)
    }
  }

  playNextSound() {
    const { activeSound } = this.state
    const {
      sounds,
      fetchSoundLinks,
      soundActionFinished,
    } = this.props
    const { url } = activeSound
    const activeSoundIndex = sounds.indexOf(url)
    const nextSoundUrl = activeSoundIndex === sounds.length - 1 ? sounds[0] : sounds[activeSoundIndex + 1]
    fetchSoundLinks(nextSoundUrl)
    this.setState({ activeSound: { url: nextSoundUrl } })
    soundActionFinished()
  }

  addSound() {
    const { activeSound } = this.state
    const { scSounds, isPlaying, soundActionStarted } = this.props
    const activePlayer = !!scSounds && scSounds.filter((player) => player.permalink_url === activeSound.url)
    if (!isPlaying && activePlayer && activePlayer.length) {
      this.setSoundSource(activePlayer[0])
      soundActionStarted()
    }
  }

  displayPageDetails(show) {
    this.setState({ displayAboutSection: show, displayPostView: !show })
  }

  render() {
    const {
      displayAboutSection,
      displayPostView,
      welcomePage,
      isMobile,
      previewSet,
    } = this.state
    const { audioSrc } = this.props
    const imgClassName = `NO__welcome_img NO__welcome_img-show NO__welcome_img_black`
    return (
      <div>
        {!!welcomePage && (
          <audio id='noAudio' controls className='NO__audio' controlsList='nodownload'> {/*eslint-disable-line*/}
            <source src={audioSrc || ''} type='audio/mpeg' />
          </audio>
        )}
        {!isMobile && !welcomePage && !displayAboutSection && !previewSet
          && (
            <div
              onClick={() => this.setState({ previewSet: true })}
              role='presentation'
            >
              <img alt='NOIMAGE' src={noLogoImgSrc} className={imgClassName} style={{ height: '100vH' }} />
            </div>
          )}
        {!isMobile && !welcomePage && !displayAboutSection && previewSet
          && (
            <div
              role='presentation'
              onClick={() => this.setState({ welcomePage: true })}
            >
              <img alt='NOIMAGE' src={imgSrc} className={imgClassName} />
            </div>
          )}
        {isMobile && !welcomePage && (
          <div
            className='NO__welcome-preview'
            role='presentation'
            onClick={() => this.setState({ welcomePage: true })}
          >
            <img alt='NOIMAGE' src={brokenWhite} className={imgClassName} />
          </div>
        )}
        {!displayAboutSection && welcomePage && (
          <Welcome
            displayPageDetails={this.displayPageDetails}
            displayPostView={displayPostView}
            playNextSound={this.playNextSound}
          />
        )}
        {displayAboutSection && !!audioSrc && <About displayPageDetails={this.displayPageDetails} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  signType: state.signInStatus.type,
  posts: state.postsData.posts,
  sounds: !!state.musicData.sounds && !!state.musicData.sounds.length && mapSoundMetafields(state.musicData.sounds[0]),
  collection: state.musicData.collection,
  scSounds: state.musicData.sc_sounds,
  indexDescription: state.fieldsData.fields.length && selectFieldValue(state.fieldsData.fields, 'description'),
  uniqueCategories: selectUniqueCategories(state.postsData.posts),
  loading: state.postsData.isLoading,
  isPlaying: state.musicData.is_playing,
  audioSrc: state.musicData.sc_source,
})
const mapDispatchToProps = (dispatch) => ({
  signIn: () => dispatch(signInAction()),
  fetchContents: (params) => dispatch(fetchContent(params)),
  fetchSoundLinks: (url) => dispatch(fetchSCCollection(url)),
  getMusicSC: (authorId) => dispatch(getSCMusic(authorId)),
  soundActionStarted: () => dispatch(soundStartedAction()),
  soundActionFinished: () => dispatch(soundFinishedAction()),
  setAudioSrc: (url) => dispatch(setAudioSource(url)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
