/* eslint-disable */
import React from 'react'
import axios from 'axios'
import imgAboutSrc from '../images/68476430_608275159696277_7376439703328784384_o.png'
import logoPost from '../images/logo.jpg'
import aboutText from './description'

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
    axios.get(`https://api.cosmicjs.com/v1/${process.env.BUCKET_ID}/objects`, {
      params: {
        type: 'archives',
        read_key: process.env.READ_KEY,
      },
    })
      .then((response) => {
        if (!response.data.objects) {
          _this.setState({
            error: true,
            loading: false,
          })
        }
        if (response.data.objects && response.data.objects.length) {
          const performanceObj = response.data.objects.filter((section) => section.metadata.navigation === 'about').reverse()
          _this.setState({
            sections: response.data.objects,
            activeSections: performanceObj,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  filterSections(category) {
    const { sections, toggleNavigation, isMobile } = this.state
    const activeItems = sections.filter((section) => section.metadata.navigation === category)
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
    const {
      activeSections,
      toggleNavigation,
      isMobile,
      activateScroll,
    } = this.state
    let feed = <div />
    if (activeSections.length) {
      feed = activeSections.map((item) => {
        if (item.metadata.navigation === 'about') {
          const paragraphs = Math.random() * (aboutText.length - aboutText.length / 2) + aboutText.length / 2
          Math.floor(paragraphs)
          const row = aboutText.map((text) => <p>{text}</p>)
          // eslint-disable-next-line
          let feed = []
          // eslint-disable-next-line
          for (let i = 0; i <= aboutText.length; i++) {
            const divStyle = {
              fontWeight: Math.random() * (700 - 400) + 400,
              color: (Math.random() * (3 - 1) + 1) < 1.5 ? '#ff0000' : '#000000',
            }
            feed.push(<div className='NO_about-feed-item-intro' style={divStyle}>{row[Math.floor(Math.random() * Math.floor(aboutText.length))]}</div>)
          }
          if (activateScroll) {
            this.setState({ activateScroll: false })
          }
          return feed
        }
        return (
          <div className='NO__about-feed-item'>
            {/* eslint-disable-next-line */}
            {!!item.content && <div dangerouslySetInnerHTML={{__html: item.content }} />}
          </div>
        )
      })
    }
    let navigationSection = ['about', 'sculpture', 'sound', 'installation', 'performance', 'fashion', 'painting', 'photography']
    return (
      <div className='NO__about-page' onScroll={this.handleScroll}>
        {/* eslint-disable-next-line */}
        <img
          className='NO__dot NO__about'
          src={imgAboutSrc}
          onClick={isMobile ? this.returnPrevState : () => window.close()}
        />
          <a href='/00000'>
            <img className='NO__dot' src={logoPost} onClick={this.viewMode} />
          </a>
          {toggleNavigation &&
            <div className="NO__about-nav">
              {navigationSection.map((item) => <div className="NO__about-nav-title" key={item} role='presentation' onClick={() => this.filterSections(item)}>{item}</div>)}
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
