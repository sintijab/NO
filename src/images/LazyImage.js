import React from 'react';

class LazyImage extends React.Component{
  componentDidMount() {
    window.lazyLoadInstance.update();
  }

  componentDidUpdate() {
    window.lazyLoadInstance.update();
  }
  render() {
    const { src, className = '', alt = 'NO_img' } = this.props;
    const lazyImageClass = `lazy-image ${className}`
    return (
      <img
        alt={alt}
        className={lazyImageClass}
        data-src={src}
        data-srcset={src}
        data-sizes="100w"
      />
    )
  }
}

export default LazyImage;
