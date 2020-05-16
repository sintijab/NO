/* eslint react/prop-types: 0 */
import React from 'react'
import { connect } from 'react-redux'
import { getCookie } from '../functions'
import { signInAction } from '../actions/signActions'
import { addContent, requestContent } from '../actions/postActions'
import { selectFieldValue } from '../selectors'
import getParams from './functions'
import inputImgicon from '../images/info.png'
import closeFormIcon from '../images/close.png'

class PostForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      article: '',
      author: '',
      imgurl: '',
      videourl: '',
      font: '',
      fontSize: '',
      categories: '',
      showCategories: false,
      tooltip: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.selected_font = React.createRef()
  }

  componentDidMount() {
    const { signStatusAction } = this.props
    if (!getCookie('val')) {
      signStatusAction()
    }
  }

  componentDidUpdate() {
    const { loading, submit } = this.props
    if (loading) {
      submit(true)
    }
  }

  handleChange(event) {
    const { target } = event
    const { value, name } = target
    this.setState({
      [name]: value,
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const {
      title = '',
      article,
      author,
      font,
      fontSize,
      imgurl,
      videourl,
      categories,
    } = this.state
    const { postFormAction, requestPostForm } = this.props
    if (getCookie('val') && title.length && categories.length) {
      const params = getParams({
        title,
        article,
        author,
        font,
        fontSize,
        imgurl,
        videourl,
        categories,
      })
      requestPostForm()
      postFormAction(params)
    }
  }

  render() {
    const {
      title,
      article,
      author,
      imgurl,
      videourl,
      font,
      fontSize,
      categories,
      showCategories,
      tooltip,
    } = this.state
    const {
      uniquePostCategories,
      imgFieldInfo,
      mediaFieldInfo,
      catFieldInfo,
      onClose,
    } = this.props
    const fontName = `NO__font--${font} NO__font-size--${fontSize}`
    const fontPreviewText = <span className={fontName}>{title}</span>
    const categoryFlows = uniquePostCategories.map((item) => (
      <li>
        {item.replace(/\s/g, '').split(',').map((category) => (
          <span
            className='cat-flows-item'
            role='presentation'
            onClick={() => this.setState({ categories: `${categories.replace(/\s/g, '')}${categories && ','}${category}` })}
          >
            {category}
          </span>
        ))}
      </li>
    ))

    return (
      <div>
        <form className='NO__post_form' onSubmit={this.handleSubmit}>
          <img
            className='NO_form-close-icon'
            src={closeFormIcon}
            alt='Close'
            role='presentation'
            onClick={() => onClose()}
          />
          <div className='NO__post_form-group'>
            <input
              id='title'
              required
              type='text'
              name='title'
              className='NO__post_form-control'
              placeholder='* Title'
              value={title}
              onChange={this.handleChange}
            />
            <select className='NO__post_form-control' name='font' value={font} onChange={this.handleChange}>
              <option value='default' defaultValue>Font style: default PT Mono</option>
              <option value='permanent-marker'>permanent-marker</option>
              <option value='archivo-black'>archivo-black</option>
              <option value='megrim'>megrim</option>
              <option value='vidaloka'>vidaloka</option>
              <option value='allerta-stencil'>allerta-stencil</option>
              <option value='press-start-2p'>press-start-2p</option>
              <option value='cutive-mono'>cutive-mono</option>
              <option value='major-mono-display'>major-mono-display</option>
              <option value='cormorant-sc'>cormorant-sc</option>
              <option value='zcool-kuaiLe'>zcool-kuaiLe</option>
              <option value='montserrat-subrayada'>montserrat-subrayada</option>
              <option value='anton'>anton</option>
              <option value='share-tech-mono'>share-tech-mono</option>
              <option value='libre-barcode-39'>libre-barcode-39</option>
              <option value='monsieur-la-doulaise'>monsieur-la-doulaise</option>
              <option value='zilla-slab-highlight'>zilla-slab-highlight</option>
              <option value='monofett'>monofett</option>
              <option value='times-new-roman'>times-new-roman</option>
            </select>
            <select
              className='NO__post_form-control'
              name='fontSize'
              value={fontSize}
              onChange={this.handleChange}
            >
              <option value='1' defaultValue>Font size: 1rem</option>
              <option value='1-2'>1.2rem</option>
              <option value='1-5'>1.5rem</option>
              <option value='1-7'>1.7rem</option>
              <option value='2'>2rem</option>
              <option value='2-2'>2.2rem</option>
              <option value='2-5'>2.5rem</option>
              <option value='2-7'>2.7rem</option>
              <option value='3'>3rem</option>
            </select>
            {!!title.length && (
              <p style={{ background: 'white' }}>
                {fontPreviewText}
                <span style={{ float: 'right', padding: '3px' }}>
                  title preview
                </span>
              </p>
            )}
            <textarea
              id='article'
              rows='10'
              type='text'
              name='article'
              className='NO__post_form-control NO__form-text-area'
              placeholder=' Description'
              value={article}
              onChange={this.handleChange}
            />
            <input
              id='author'
              type='text'
              name='author'
              className='NO__post_form-control'
              placeholder=' Author'
              value={author}
              onChange={this.handleChange}
            />
            <div className='NO__post_form-input'>
              <input
                id='imgurl'
                value={imgurl}
                type='url'
                name='imgurl'
                className='NO__post_form-control'
                placeholder=' Image'
                onChange={this.handleChange}
              />
              <img
                alt='img'
                className='NO__post_form-img'
                src={inputImgicon}
                role='presentation'
                onClick={() => this.setState({ tooltip: tooltip !== 'imgFieldInfo' ? 'imgFieldInfo' : null })}
              />
            </div>
            {tooltip === 'imgFieldInfo' && <div className='NO_post_tooltip'>{imgFieldInfo}</div>}
            {!!imgurl.length
              && (
                <div>
                  <span className='cat-flows'>Preview: </span>
                  <img
                    src={imgurl}
                    alt='Img preview'
                    className='NO__post_form-control NO__post_form-control-preview'
                  />
                </div>
              )}
            <div className='NO__post_form-input'>
              <input
                id='videourl'
                value={videourl}
                type='url'
                name='videourl'
                className='NO__post_form-control'
                placeholder=' Media'
                onChange={this.handleChange}
              />
              <img
                alt='img'
                className='NO__post_form-img'
                src={inputImgicon}
                role='presentation'
                onClick={() => this.setState({ tooltip: tooltip !== 'mediaFieldInfo' ? 'mediaFieldInfo' : null })}
              />
            </div>
            {tooltip === 'mediaFieldInfo' && <div className='NO_post_tooltip'>{mediaFieldInfo}</div>}
            {!!videourl.length && (
              <div>
                <span className='cat-flows'>Preview: </span>
                <iframe
                  width='100%'
                  height='100%'
                  title='vid'
                  className='NO__overlay-vid'
                  src={videourl}
                  frameBorder='0'
                  allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  allowtransparency
                />
              </div>
            )}
            <div className='NO__post_form-input'>
              <input
                id='categories'
                required
                type='text'
                name='categories'
                className='NO__post_form-control'
                placeholder='* Categories'
                value={categories}
                onChange={this.handleChange}
              />
              <img
                alt='img'
                className='NO__post_form-img'
                src={inputImgicon}
                role='presentation'
                onClick={() => this.setState({ tooltip: tooltip !== 'catFieldInfo' ? 'catFieldInfo' : null })}
              />
            </div>
            {tooltip === 'catFieldInfo' && <div className='NO_post_tooltip'>{catFieldInfo}</div>}
            <div
              className='cat-flows cat-flows-title'
              role='presentation'
              onClick={() => this.setState({ showCategories: !showCategories })}
            >
              <span>Existing category flows: </span>
              {!showCategories && <span>&#9661;</span>}
              {showCategories && <span>&#9651;</span>}
            </div>
            {showCategories && <ul className='cat-flows'>{categoryFlows}</ul>}
            <button
              type='submit'
              className='btn btn-info NO__post_form-control--submit'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  data: state.signInStatus.uData,
  addPostSuccess: state.postsData.post,
  imgFieldInfo: state.fieldsData.fields.length && selectFieldValue(state.fieldsData.fields, 'imgfieldinfo'),
  mediaFieldInfo: state.fieldsData.fields.length && selectFieldValue(state.fieldsData.fields, 'mediafieldinfo'),
  catFieldInfo: state.fieldsData.fields.length && selectFieldValue(state.fieldsData.fields, 'catfieldinfo'),
  loading: state.postsData.isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  signStatusAction: () => dispatch(signInAction()),
  postFormAction: (params) => dispatch(addContent(params)),
  requestPostForm: () => dispatch(requestContent()),
})
export default connect(mapStateToProps, mapDispatchToProps)(PostForm)
