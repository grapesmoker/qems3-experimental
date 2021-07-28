import React, { Props } from 'react';
import { Link, NavLink, withRouter, Switch, Route } from 'react-router-dom';
import Api from '../api/Api';
import * as models from '../models';
import * as actions from '../store/actions'
import { connect } from 'react-redux';
import { PrivateRoute } from '../router/Routes'
import {Category} from "../models";

const updateCategories = (value: models.Category[]) => ({type: actions.LOAD_CATEGORIES, payload: {categories: value}})

const mapStateToProps = (state: models.State) => {
    return {
        categories: state.categories
    }
}

const mapDispatchToProps = {
    updateCategories
}

class SidebarTreeNode extends React.Component<any> {

    componentDidMount() {

    }

    render() {
        // console.log('rendering cagetegory ', this.props.node)
        // console.log('categories: ', this.props.categories)
        return (
            <div className="clr-tree-node">
                <div className="clr-tree-node-content-container">

                    <div className="clr-treenode-content">
                        <Link className="clr-treenode-link" to={'/categories/' + this.props.node.id}>{this.props.node.name}</Link>
                    </div>
                </div>
                <div className="clr-treenode-children">
                    {
                        this.props.node.subcategories.map(child_key => {
                            let child: Category = this.props.categories[child_key]
                            // console.log('subcategory: ', child)
                            return <SidebarTreeNode key={child.id} node={child} categories={this.props.categories}/>
                        })
                    }
                </div>
            </div>
        )
    }
}


class SidebarCategories extends React.Component<any> {

    render() {
        return (
            
            <div className="clr-tree">
                {
                    Object.keys(this.props.categories).map(key => {
                        let element: Category = this.props.categories[key]
                        if (element.parent_category === null) {
                            return <SidebarTreeNode key={element.id} node={element} categories={this.props.categories}/>
                        }
                    })
                    // this.props.categories.keys(element => {
                    //     console.log('element: ', element)
                    //     return <SidebarTreeNode key={element.id} node={element} />
                    // })
                };
            </div>
        )
    }
}

class Sidebar extends React.Component<any> {

    async componentDidMount() {

        const categories = await Api.getCategories()
        this.props.updateCategories(categories)
    }

    render() {

        // console.log('rendering sidebar props: ', this.props.categories)
        return (
            <nav className="sidenav">
                <section className="sidenav-content">
                    <Switch>
                        <Route path="/categories/">
                            <Link className="nav-link" to={this.props.match.url + '/add'}>New Category</Link>
                        </Route>
                    </Switch>
                    <section className="nav-group">
                        <Switch>
                            <Route path="/categories/">
                                <SidebarCategories categories={this.props.categories}/>
                            </Route>
                        </Switch>
                    </section>
                </section>
            </nav>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sidebar))