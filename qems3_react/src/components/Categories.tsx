import React, { Props } from 'react';
import { Link, NavLink, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { PrivateRoute } from '../router/Routes';
import Sidebar from './Sidebar';
import * as models from '../models'
import * as actions from '../store/actions'
import Api from '../api/Api'
import {Category} from "../models";

const addCategory = (value: any) => ({type: actions.ADD_CATEGORY, payload: {category: value}})

const mapStateToProps = (state: models.State) => {
    return {
        categories: state.categories
    }
}

const mapDispatchToProps = {
    addCategory
}


export class EditCategory extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            categoryId: this.props.categoryId ? this.props.categoryId : null,
            categoryName: this.props.categoryName ? this.props.categoryName : null,
            categoryDescription: this.props.categoryDescription ? this.props.categoryDescription : null,
            categoryParent: this.props.categoryParent ? this.props.categoryParent : null
        }
        this.updateCategoryName = this.updateCategoryName.bind(this)
        this.updateCategoryDescription = this.updateCategoryDescription.bind(this)
        this.updateCategoryParent = this.updateCategoryParent.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    updateCategoryName(ev) {
        this.setState({categoryName: ev.target.value})
    }

    updateCategoryDescription(ev) {
        this.setState({categoryDescription: ev.target.value})
    }

    updateCategoryParent(ev) {
        this.setState({categoryParent: ev.target.value})
    }

    async handleSave(ev) {
        ev.preventDefault()
        if (!this.props.categoryId) {
            const savedCategory: models.Category | null = await Api.addCategory({
                name: this.state.categoryName,
                description: this.state.categoryDescription,
                parent_category: this.state.categoryParent
            })
            this.props.addCategory(savedCategory)
        }
        else {
            console.log('editing not implemented')
        }
    }

    render() {
        return (
            <form className="clr-form clr-form-horizontal">
                <div className="clr-form-control">
                    <label className="clr-control-label" htmlFor="name">Category Name</label>
                    <div className="clr-control-container">
                        <div className="clr-input-wrapper">
                            <input type="text" id="name" placeholder="category name" className="clr-input" onChange={this.updateCategoryName} />
                        </div>
                    </div>
                </div>
                <div className="clr-form-control">
                    <label className="clr-control-label" htmlFor="description">Description</label>
                    <div className="clr-control-container">
                        <div className="clr-textarea-wrapper">
                            <textarea id="description" className="clr-textarea" onChange={this.updateCategoryDescription}/>
                        </div>
                    </div>
                </div>
                <div className="clr-form-control">
                    <label className="clr-control-label" htmlFor="parent">Parent Category</label>
                    <div className="clr-control-container">
                        <div className="clr-select-wrapper">
                            <select id="parent"  className="clr-select" onChange={this.updateCategoryParent}>
                                {
                                    Object.values(this.props.categories).map(category => {
                                        // @ts-ignore
                                        return <option key={category.id} value={category.id}>{category.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="clr-form-control">
                    <button className="btn btn-primary" type="button" onClick={this.handleSave}>Save</button>
                </div>
            </form>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategory)