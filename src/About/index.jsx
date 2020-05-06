/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import imgAboutSrc from '../images/68476430_608275159696277_7376439703328784384_o.png'
import menuIcon from '../images/menu_png.png'
import fetchContent from '../actions/postActions'
import { selectPageObj } from '../selectors/posts'

class About extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sections: [],
      activeSection: null,
      activeTab: 'about',
      isMobile: window.innerWidth < 800,
      toggleNavigation: window.innerWidth > 800 && true,
    }
    this.setActiveTab = this.setActiveTab.bind(this)
    this.returnPrevState = this.returnPrevState.bind(this)
  }

  componentDidMount() {
    const { fetchContent } = this.props;
    fetchContent('archives');
  }

  setActiveTab(category) {
    const { toggleNavigation, isMobile} = this.state
    const { sections } = this.props
    const pageObj = selectPageObj(sections, category)
    this.setState({
      activeTab: category,
      activeSection: pageObj,
    })
    if (isMobile) {
      this.setState({
        toggleNavigation: !toggleNavigation,
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { activeSection, activeTab } = this.state
    const { sections } = this.props;
    if (sections && !activeSection) {
      const pageObj = selectPageObj(sections, activeTab)
      this.setState({ activeSection: pageObj })
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
      activeSection,
    } = this.state
    let feed = <div />
    if (activeSection) {
      feed = (
          <div className='NO__about-feed-item'>
            {!!activeSection.content && <div className="NO__about-feed-content" dangerouslySetInnerHTML={{__html: activeSection.content }} />}
          </div>
        )
    }
    let navigationSection = ['about', 'sculpture', 'sound', 'installation', 'performance', 'fashion', 'painting', 'photography']
    return (
      <div className='NO__about-page' onScroll={this.handleScroll}>
        {/* eslint-disable-next-line */}
        <div>
          <img className='NO__dot NO__about' src={menuIcon} onClick={isMobile ? this.returnPrevState : () => window.close()} />
        </div>
        <a href='/00000'>
          <img
            className='NO__dot'
            src={imgAboutSrc}
            onClick={this.viewMode}
          />
        </a>
          {toggleNavigation &&
            <div className="NO__about-nav">
              {navigationSection.map((item) => <div className="NO__about-nav-title" key={item} role='presentation' onClick={() => this.setActiveTab(item)}>{item}</div>)}
            </div>
          }
          <div className="NO__about-feed">
            {feed}
          </div>
     </div>
   )
  }
}
const mapStateToProps = (state) => ({
  sections: state.pagesData.pages,
});

const mapDispatchToProps = (dispatch) => ({
  fetchContent: (params) =>
    dispatch(fetchContent(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(About)
