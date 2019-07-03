import React from 'react';
import { connect } from 'react-redux';
import { FETCH_LOGIN } from '@src/store/actions/ActionTypes';
import { Route } from "react-router-dom";
import MyLoadable from '@src/router/routeLoadable'
import '@src/css/app.less';

class App extends React.Component {

  componentDidMount() {
    if (!this.props.user.isLogin) {
      this.props.login({
        url: '/login',
        method: 'post',
        data: {
          userName: 'admin',
          password: '123456'
        }
      }).then(res => {
        console.log(res)
      })
    }
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={MyLoadable({ loader: () => import('@src/pages/Home') })} />
        <Route exact path="/about" component={MyLoadable({ loader: () => import('@src/pages/About') })} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    login: requestConfig => {
      return new Promise((resolve, reject) => {
        dispatch({ type: FETCH_LOGIN, actionParams: { requestConfig, resolve, reject } });
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
