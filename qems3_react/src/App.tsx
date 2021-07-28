import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { Component } from 'react';
import { connect } from 'react-redux';
import Login from './components/Login';
import Main from './components/Main';
import * as actions from './store/actions';
import * as models from './models';
import './App.css';
import Api from './api/Api'
import { User } from './models';
import { PrivateRoute } from './router/Routes'


const updateUser = (value: User) => ({type: actions.UPDATE_USER, payload: {user: value}})

const mapStateToProps = (state: models.State) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {
    updateUser
}

class App extends Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {isLoaded: false}
    }

    async componentDidMount() {
        const user = await Api.getUser()
        this.setState({isLoaded: true})
        this.props.updateUser(user)
    }

    render() {
        let user = this.props.user
        
        if (this.state.isLoaded) {
            return(
                <Router>
                    <Switch>
                        <PrivateRoute path="/categories" user={user}>
                            <Main />
                        </PrivateRoute>
                        <PrivateRoute exact path="/" user={user}>
                            <Main />
                        </PrivateRoute>
                        <Route path="/login">
                            <Login user={user}/>
                        </Route>
                    </Switch>
                </Router>
                
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
