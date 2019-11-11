import React from 'react'
import axios from 'axios'
import * as imgAboutSrc from '../images/68476430_608275159696277_7376439703328784384_o.png'

class About extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sections: [],
      activeSections: [],
    }
    this.filterSections = this.filterSections.bind(this)

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
          _this.setState({
            sections: response.data.objects,
            activeSections: response.data.objects.filter(section => section.metadata.navigation === 'about'),
          })
        }
      }
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  filterSections(category) {
    const { sections } = this.state
    let activeItems = sections.filter(section => section.metadata.navigation === category)
    if (activeItems.length) {
      activeItems.reverse()
      this.setState({
        activeSections: activeItems,
      })
    }
  }

  render() {
    const { activeSections } = this.state
    let feed = <div />
    if (activeSections.length) {
      feed = activeSections.map(item => {
        return (
          <div className="NO__about-feed-item">
            {!!item.content && <div dangerouslySetInnerHTML={{__html: item.content}} />}
          </div>
        )
      })
    }
      return (
        <div className="NO__about-page" >
        <img className='NO__dot NO__about' src={imgAboutSrc} onClick={() => {window.close()}}/>
          <div className="NO__about-nav">
            <div className="NO__about-nav-title" onClick={() => this.filterSections('sculpture')}>sculpture</div>
            <div className="NO__about-nav-title" onClick={() => this.filterSections('photography')}>photography</div>
            <div className="NO__about-nav-title" onClick={() => this.filterSections('sound')}>sound</div>
            <div className="NO__about-nav-title" onClick={() => this.filterSections('performance')}>performance</div>
            <div className="NO__about-nav-title" onClick={() => this.filterSections('design')}>design</div>
          </div>
          <div className="NO__about-feed">
            {feed}
          </div>
       </div>
     )
  }
}
export default About
