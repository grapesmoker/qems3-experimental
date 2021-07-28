import React, { Props } from 'react';
import { Link, NavLink, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { PrivateRoute } from '../router/Routes';
import Sidebar from './Sidebar';
import * as models from '../models'
import AddCategory from './Categories'

const mapStateToProps = (state: models.State) => {
    return {
        user: state.user
    }
}


class Header extends React.Component<any> {

    render() {
        return (
            <header className="header header-6">
                <div className="branding">
                    <NavLink to="/">QEMS 3</NavLink>
                </div>
                <div className="header-nav">
                    <Link className="nav-link" to="/sets">
                        <span className="nav-text">Sets</span>
                    </Link>
                    <Link className="nav-link" to="/distributions">
                        <span className="nav-text">Distributions</span>
                    </Link>
                    <Link className="nav-link" to="/categories">
                        <span className="nav-text">Categories</span>
                    </Link>
                </div>
                <div className="header-actions">
                    login, register
                </div>
            </header>
        )
    }
}

class Main extends React.Component<any> {

    render() {
        // TODO: make sidebar selection variale
        return (
            <div className="main-container">
                <Header />
                <div className="content-container">
                    <Sidebar />
                    <div className="content-area">
                    <Switch>
                        <PrivateRoute exact path={"/categories"} user={this.props.user}>
                            some stuff about categories here
                        </PrivateRoute>
                        <PrivateRoute path={"/categories/add"} user={this.props.user}>
                            <AddCategory />
                        </PrivateRoute>
                    </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withRouter(Main));