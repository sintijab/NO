import React from 'react'
import axios from 'axios'
import * as imgAboutSrc from '../images/68476430_608275159696277_7376439703328784384_o.png'
import * as logoPost from '../images/logo.jpg'

class About extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sections: [],
      activeSections: [],
      isMobile: window.innerWidth < 1400,
      toggleNavigation: window.innerWidth > 1400 && true,
    }
    this.filterSections = this.filterSections.bind(this)
    this.returnPrevState = this.returnPrevState.bind(this)

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
    const { sections, toggleNavigation } = this.state
    let activeItems = sections.filter(section => section.metadata.navigation === category)
    if (activeItems.length) {
      activeItems.reverse()
      this.setState({
        activeSections: activeItems,
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

  render() {
    const { activeSections, toggleNavigation, isMobile } = this.state
    let feed = <div />
    if (activeSections.length) {
      feed = activeSections.map(item => {
        const feedItemClassName = item.metadata.navigation === 'about' ? 'NO_about-feed-item-intro' : 'NO__about-feed-item'
        return (
          <div className={feedItemClassName}>
            {!!item.content && <div dangerouslySetInnerHTML={{__html: item.content}} />}
          </div>
        )
      })
    }
      return (
        <div className="NO__about-page" >
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
