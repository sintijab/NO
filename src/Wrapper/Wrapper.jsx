/* eslint react/prop-types: 0 */
import React from 'react'
import { connect } from 'react-redux'

import { signInAction } from '../actions/signActions'
import { fetchSCCollection, getSCMusic } from '../actions/soundActions'
import { fetchContent } from '../actions/postActions'
import { selectUniqueCategories, selectFieldValue, mapSoundMetafields } from '../selectors'
import Welcome from '../Welcome/Welcome'
import About from '../About'

import SC from '../sc'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSound: {
        url: null,
      },
      activeAuthorId: null,
      soundStarted: false,
      displayAboutSection: window.location.href.indexOf('about') > -1,
      displayPostView: false,
    }

    this.playSound = this.playSound.bind(this)
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
    } = this.state
    const {
      fetchSoundLinks,
      collection,
      scSounds,
      getMusicSC,
      sounds,
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
  }

  playNextSound() {
    const { activeSound } = this.state
    const { sounds, fetchSoundLinks } = this.props
    const { url } = activeSound
    const activeSoundIndex = sounds.indexOf(url)
    const nextSoundUrl = activeSoundIndex === sounds.length - 1 ? sounds[0] : sounds[activeSoundIndex + 1]
    fetchSoundLinks(nextSoundUrl)
    this.setState({ activeSound: { url: nextSoundUrl }, soundStarted: false })
  }

  playSound(activePlayer) {
    SC.stream(`${activePlayer.id}`).then((player) => { player.play(); player.addEventListener('ended', () => this.playNextSound()) })
  }

  addSound() {
    const { soundStarted, activeSound } = this.state
    const { scSounds } = this.props
    const activePlayer = !!scSounds && scSounds.filter((player) => player.permalink_url === activeSound.url)
    if (!soundStarted && activePlayer && activePlayer.length) {
      this.playSound(activePlayer[0])
      this.setState({ soundStarted: true }) // eslint-disable-line
    }
  }

  displayPageDetails(show) {
    this.setState({ displayAboutSection: show, displayPostView: !show })
  }

  render() {
    const { displayAboutSection, displayPostView } = this.state
    return (
      <div>
        {!displayAboutSection && (
          <Welcome
            addSound={this.addSound}
            displayPageDetails={this.displayPageDetails}
            displayPostView={displayPostView}
          />
        )}
        {displayAboutSection && <About addSound={this.addSound} displayPageDetails={this.displayPageDetails} />}
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
})
const mapDispatchToProps = (dispatch) => ({
  signIn: () => dispatch(signInAction()),
  fetchContents: (params) => dispatch(fetchContent(params)),
  fetchSoundLinks: (url) => dispatch(fetchSCCollection(url)),
  getMusicSC: (authorId) => dispatch(getSCMusic(authorId)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
