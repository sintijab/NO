/* eslint react/prop-types: 0 */
import React from 'react'
import LazyLoad from 'vanilla-lazyload'
import lazyloadConfig from './lazyload'

if (!window.lazyLoadInstance) {
  window.lazyLoadInstance = new LazyLoad(lazyloadConfig)
}

class LazyImage extends React.Component {
  componentDidMount() {
    if (window.lazyLoadInstance) {
      window.lazyLoadInstance.update()
    }
  }

  componentDidUpdate() {
    if (window.lazyLoadInstance) {
      window.lazyLoadInstance.update()
    }
  }

  render() {
    const { src, className = '', alt = 'NO_img' } = this.props
    const lazyImageClass = `lazy-image ${className}`
    return (
      <img
        alt={alt}
        className={lazyImageClass}
        data-src={src}
        data-srcset={src}
        data-sizes='100w'
      />
    )
  }
}

export default LazyImage
