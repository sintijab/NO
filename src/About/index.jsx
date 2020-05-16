/* eslint-disable */
import React from 'react'
import LazyImage from '../images/LazyImage'
import { connect } from 'react-redux'
import axios from 'axios'
import imgAboutSrc from '../images/68476430_608275159696277_7376439703328784384_o.png'
import menuIcon from '../images/menu_png.png'
import { fetchContent } from '../actions/postActions'
import { updateURL } from '../functions'
import { selectPageObj, selectPageContent } from '../selectors'

class About extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sections: [],
      pageContent: [],
      activeTab: 'about',
      isMobile: window.innerWidth < 800,
      toggleNavigation: window.innerWidth > 800 && true,
    }
    this.setActiveTab = this.setActiveTab.bind(this)
    this.returnPrevState = this.returnPrevState.bind(this)
  }

  componentDidMount() {
    const { pageContent, activeTab } = this.state
    const { sections } = this.props;
    if (sections && sections.length && !pageContent.length) {
      this.setState({ pageContent: selectPageContent(sections, activeTab) })
    }
  }

  componentDidUpdate() {
    const { pageContent, activeTab } = this.state
    const { sections } = this.props;
    if (sections && sections.length && !pageContent.length) {
      this.setState({ pageContent: selectPageContent(sections, activeTab) })
    }
  }

  setActiveTab(category) {
    const { toggleNavigation, isMobile} = this.state
    const { sections } = this.props
    this.setState({
      activeTab: category,
      pageContent: [],
    })
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

  render() {
    const {
      activeTab,
      toggleNavigation,
      isMobile,
      pageContent,
    } = this.state
    const { displayPageDetails } = this.props
    let navigationSection = ['about', 'sculpture', 'sound', 'installation', 'performance', 'fashion', 'painting', 'photography']
    return (
      <div className='NO__about-page' onScroll={this.handleScroll}>
        {/* eslint-disable-next-line */}
        <div>
          <img className='NO__dot NO__about' src={menuIcon} onClick={isMobile ? this.returnPrevState : () => window.close()} />
        </div>
        <div>
          <img
            className='NO__dot'
            src={imgAboutSrc}
            role='presentation'
            onClick={() => { updateURL('about', false); displayPageDetails(false); }}
          />
        </div>
          {toggleNavigation &&
            <div className="NO__about-nav">
              {navigationSection.map((item) => <div className="NO__about-nav-title" key={item} role='presentation' onClick={() => this.setActiveTab(item)}>{item}</div>)}
            </div>
          }
          <div className="NO__about-feed">
            {!!pageContent.length && <div className="NO__about-feed-content">
              {pageContent.map(item => {
                  const contentText = !!item.text.length && item.text.map((t) => <div dangerouslySetInnerHTML={{__html: t.value }} />) || []
                  const contentImages = !!item.img.length && item.img.map((i) => <LazyImage src={i.url} />) || []
                  return (<div>{contentImages}{contentText}</div>)
                })}
            </div>}
          </div>
     </div>
   )
  }
}
const mapStateToProps = (state) => ({
  sections: state.pagesData.pages,
});

export default connect(mapStateToProps)(About)
