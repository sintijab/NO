import React from 'react'
import axios from 'axios'
import * as imgAboutSrc from '../images/68476430_608275159696277_7376439703328784384_o.png'
import * as logoPost from '../images/logo.jpg'
import { aboutText } from './about'

class About extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sections: [],
      activeSections: [],
      isMobile: window.innerWidth < 800,
      toggleNavigation: window.innerWidth > 800 && true,
      activateScroll: false,
    }
    this.filterSections = this.filterSections.bind(this)
    this.returnPrevState = this.returnPrevState.bind(this)
    this.handleScroll = this.handleScroll.bind(this)

    const _this = this
    axios.get(`https://api.cosmicjs.com/v1/c61d0730-8187-11e9-9862-534a432d9a60/objects`, {
      params: {
        type: 'archives',
        read_key: 'reQaGkJrqvDkpuyb45enU4kYd3PWhZHUihAD7CDeW7shE1rleO',
      } })
    .then(function(response) {
      if (!response.data.objects) {
        _this.setState({
          error: true,
          loading: false,
        })
      } else {
        if (response.data.objects && response.data.objects.length) {
          const performanceObj = response.data.objects.filter(section => section.metadata.navigation === 'about').reverse()
          _this.setState({
            sections: response.data.objects,
            activeSections: performanceObj,
          })
        }
      }
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  filterSections(category) {
    const { sections, toggleNavigation, isMobile } = this.state
    let activeItems = sections.filter(section => section.metadata.navigation === category)
    if (activeItems.length) {
      activeItems.reverse()
      this.setState({
        activeSections: activeItems,
      })
    }
    if (isMobile) {
      this.setState({
        toggleNavigation: !toggleNavigation,
      })
    }
  }

  returnPrevState() {
    const { isMobile, toggleNavigation } = this.state
    if (isMobile) {
      this.setState({ toggleNavigation: !toggleNavigation })
    }
  }

  handleScroll() {
    this.setState({ activateScroll: true })
  }

  render() {
    const { activeSections, toggleNavigation, isMobile, activateScroll } = this.state
    let feed = <div />
    if (activeSections.length) {
      feed = activeSections.map(item => {
        if ( item.metadata.navigation === 'about') {
          let paragraphs = Math.random() * (aboutText.length - aboutText.length / 2) + aboutText.length / 2
          Math.floor(paragraphs)
          let text = aboutText.map((item) => <p>{item}</p>)
          let feed = []
          //eslint-disable-next-line
          for (let i = 0; i <= aboutText.length; i++) {
            const divStyle = {
              fontWeight: Math.random() * (700 - 400) + 400,
              color: (Math.random() * (3 - 1) + 1) < 1.5 ? '#ff0000' : '#000000',
            }
            feed.push(<div className='NO_about-feed-item-intro' style={divStyle}>{text[Math.floor(Math.random() * Math.floor(aboutText.length))]}</div>)
          }
          if (activateScroll) {
            this.setState({ activateScroll: false })
          }
          return feed
        }
        return (
          <div className='NO__about-feed-item'>
            {!!item.content && <div dangerouslySetInnerHTML={{__html: item.content}} />}
          </div>
        )
      })
    }
      return (
        <div className="NO__about-page" onScroll={this.handleScroll}>
        <img className='NO__dot NO__about' src={imgAboutSrc} onClick={isMobile ? this.returnPrevState : () => window.close()}/>
        <a href='/00000'><img className='NO__dot' src={logoPost} onClick={this.viewMode} /></a>
          {toggleNavigation &&
            <div className="NO__about-nav">
              <div className="NO__about-nav-title" onClick={() => this.filterSections('about')}>about</div>
              <div className="NO__about-nav-title" onClick={() => this.filterSections('sculpture')}>sculpture</div>
              <div className="NO__about-nav-title" onClick={() => this.filterSections('sound')}>sound</div>
              <div className="NO__about-nav-title" onClick={() => this.filterSections('installation')}>installation</div>
              <div className="NO__about-nav-title" onClick={() => this.filterSections('performance')}>performance</div>
              <div className="NO__about-nav-title" onClick={() => this.filterSections('fashion')}>fashion</div>
              <div className="NO__about-nav-title" onClick={() => this.filterSections('painting')}>painting</div>
              <div className="NO__about-nav-title" onClick={() => this.filterSections('photography')}>photography</div>
            </div>
          }
          <div className="NO__about-feed">
            {feed}
          </div>
       </div>
     )
  }
}
export default About
