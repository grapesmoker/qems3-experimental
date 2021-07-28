import React, { Props } from 'react';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import * as models from '../models';
import Cookies from 'universal-cookie';


const updateUsername = (value: String) => ({type: actions.UPDATE_USERNAME, payload: {username: value}})
const updatePassword = (value: String) => ({type: actions.UPDATE_PASSWORD, payload: {password: value}})
const updateEmail = (value: String) => ({type: actions.UPDATE_EMAIL, payload: {email: value}})
const loginFailure = (value: String) => ({type: actions.LOGIN_ERROR, payload: {error: value}})
const loginSuccess = (value: models.User) => ({type: actions.LOGIN_SUCCESS, payload: {user: value}})

// const login = (username: String, email: String, password: String) => ({
//     type: actions.LOGIN, payload: {username: username, password: password, email: email}
// })
const cookies = new Cookies()

const mapStateToProps = (state: models.State) => {
    return state.login
}

const mapDispatchToProps = {
    loginFailure,
    loginSuccess,
    updateUsername,
    updateEmail,
    updatePassword
}

class Login extends React.Component<any> {

    constructor(props) {
        super(props)
        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.updateEmail = this.updateEmail.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {

    }

    updateUsername(ev) {
        this.props.updateUsername(ev.target.value)
    }

    updatePassword(ev) {
        this.props.updatePassword(ev.target.value)
    }

    updateEmail(ev) {
        this.props.updateEmail(ev.target.value)
    }

    handleSubmit(ev) {
        ev.preventDefault()
        fetch('rest-auth/login/', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({
                username: this.props.username,
                email: this.props.email, 
                password: this.props.password,
            }),
            headers: {
                'X-CSRFTOKEN': cookies.get('csrftoken'),
                'Content-Type': 'application/json'
            }
        }).then(
            response => {
                if (!response.ok) {
                    throw new Error('Error response: ' + response.statusText)
                }
                return
            }
        ).then(
            () => {
                fetch('qsub/user/', {
                    credentials: 'include'
                }).then(
                    response => {
                        if (!response.ok) {
                            throw new Error('Error response: ' + response.statusText)
                        }
                        return response.json()
                    }
                ).then(
                    data => {
                        this.props.loginSuccess(data)
                    }
                ).catch(
                    error => {
                        console.log(error)
                    }
                )
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    render() {
        if (this.props.user !== null) {
            return (
                <Redirect to={{
                    pathname: "/"}} />
            )
        }

        return (
            <div className="login-wrapper">
                <form className="login clr-form">
                    <section className="title">
                        <h3 className="welcome">Welcome to QEMS3</h3>
                        <h5 className="hint">Log in or create an account</h5>
                    </section>
                    <div className="login-group">
                        <div className="clr-form-control">
                            <label htmlFor="username" className="clr-control-label">Username</label>
                            <div className="clr-control-container">
                                <div className="clr-input-wrapper">
                                    <input onChange={this.updateUsername} className="clr-input" type="text" id="username" name="username"></input> 
                                </div>
                            </div>
                        </div>
                        <div className="clr-form-control">
                            <label htmlFor="email" className="clr-control-label">Email</label>
                            <div className="clr-control-container">
                                <div className="clr-input-wrapper">
                                    <input onChange={this.updateEmail} className="clr-input" type="text" id="email" name="email"></input>
                                </div>
                            </div>
                        </div>
                        <div className="clr-form-control">
                            <label htmlFor="password" className="clr-control-label">Password</label>
                            <div className="clr-control-container">
                                <div className="clr-input-wrapper">
                                    <input onChange={this.updatePassword} className="clr-input" type="password" id="password" name="password"></input>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={this.handleSubmit}>Login</button>
                </form>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)