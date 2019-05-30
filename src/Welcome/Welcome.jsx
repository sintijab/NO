import React from 'react';
import { connect } from 'react-redux';
import * as imgSrc from '../images/47571265_200436654226310_2774485183145967616_n.png';
import Posts from '../Posts/Posts';
import SignForm from '../SignForm/SignForm';
import { signOutAction, signStatusAction } from '../actions/signActions.js';
import { LOGGED_IN, LOGGED_OUT } from "../actions/types"

class Welcome extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      postFeedOpened: false,
      showOverlay: false,
    }

    this.openPostFeed = this.openPostFeed.bind(this);
    this.signForm = this.signForm.bind(this);
    this.signOut = this.signOut.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);
  }

  componentDidMount() {
    this.props.signStatusAction()
  }

  componentDidUpdate() {
    const { loggedIn } = this.state;
    if (this.props.signType === LOGGED_IN && !loggedIn) {
      this.setState({
        loggedIn: true,
      });
    } else if (this.props.signType === LOGGED_OUT && loggedIn) {
      this.setState({
        loggedIn: false,
      });
    }
  }

  openPostFeed() {
    const { postFeedOpened } = this.state;
    this.setState({postFeedOpened: !postFeedOpened});
  }

  signForm() {
    const { showOverlay } = this.state;
      this.setState({
        showOverlay: !showOverlay,
      })
  }

  signOut() {
    this.props.signOutAction();
    this.setState({
      loggedIn: false,
    })
  }

  closeOverlay() {
    const { showOverlay } = this.state;
      this.setState({
        showOverlay: !showOverlay,
    })
  }

  render() {
    const { postFeedOpened, showOverlay, loggedIn } = this.state;
    const imgClassName = `NO__welcome_img ${!postFeedOpened ? 'NO__welcome_img-show' : 'NO__welcome_img-hide'}`;

    const postView = (
      <div className='NO__feed'>
        <Posts />
      </div>
    );

      return (
        <div>
          <div className='NO__welcome'>
            {loggedIn && <span className="NO__welcome-text NO__text">Welcome @admin</span>}
            {showOverlay && <SignForm closeOverlay={this.closeOverlay}/>}
            <img alt='NOIMAGE' src={imgSrc} className={imgClassName} onClick={this.openPostFeed} />
            {!loggedIn && <p className='NO_login NO__text' onClick={this.signForm}>Login</p>}
            {loggedIn && <p className='NO_login NO__text' onClick={this.signOut}>Logout</p>}
          </div>
          {postFeedOpened && postView}
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    signType: state.signInStatus.type,
  })
export default connect(mapStateToProps, { signOutAction, signStatusAction })(Welcome);
