import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button,
    Input, InputGroup, InputGroupAddon,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import Login from '../Login/login';
import Register from '../Register/register';

import cart from "../../assets/images/addToCarts.png";
import category from "../../assets/images/category.png";
import Logo from '../../assets/images/Udemy.png';
import search from '../../assets/images/search.png';

import * as catAction from '../../action/categoryAction';
import * as authAction from "../../action/authAction";
import * as cartAction from '../../action/cartAction';
import * as courseAction from '../../action/CourseAction';
import '../../styling.css'
let cartTotal = 0;

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            LoginModal: false,
            RegisterModal: false,
            dropdownOpen: false,
            ddlogoutopen: false,
            query: '',
            result: []
        };

        this.toggle = this.toggle.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
        this.toggleRegister = this.toggleRegister.bind(this);
        this.DropDownToggle = this.DropDownToggle.bind(this);
        this.DropDownLogoutToggle = this.DropDownLogoutToggle.bind(this);
    }

    componentDidMount() {
        this.props.action.category.getCategory();
        this.props.action.course.getCourse();

    }
    componentWillMount() {
        if (this.props.userId) {
            this.props.action.cart.getCartByUser(this.props.userId);
        }
        else if (localStorage.getItem("cart")) {
            cartTotal = JSON.parse(localStorage.getItem("cart")).length;
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleLogin() {
        this.setState(prevState => ({
            LoginModal: !prevState.LoginModal
        }));
    }

    toggleLinks() {
        this.setState(prevState => ({
            LoginModal: !prevState.LoginModal,
            RegisterModal: !prevState.RegisterModal
        }));
    }

    toggleRegister() {
        this.setState(prevState => ({
            RegisterModal: !prevState.RegisterModal
        }));
    }

    DropDownToggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    DropDownLogoutToggle() {
        this.setState(prevState => ({
            ddlogoutopen: !prevState.ddlogoutopen
        }));
    }

    btnBoughtCourse(e) {
        e.preventDefault();
        this.props.history.push('/boughtCourse')
    }

    btnMyCourse(e) {
        e.preventDefault();
        this.props.history.push('/myCourse');
    }

    btnCart(e) {
        e.preventDefault();
        this.props.history.push('/cart');
    }

    btnLogout(e) {
        this.props.action.auth.logoutUser();
        this.props.history.push('/');
    }

    handleInputChange = (e) => {
        this.setState({
            query: e.target.value
        });
        if (e.target.value.length > 2)
            this.getSearchData();
        else {
            if (e.target.value.length === 0) {
                this.setState({ result: null })
            }
        }
    }


    onSelect(cid, e) {
        this.props.action.category.getCourseByCID(cid);
        this.props.history.push('/courseCID');
    }


    getSearchData() {
        let a = [];
        let FilteredCourse = this.props.course.filter(course => {
            return course.coursename.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1;
        });
        if (FilteredCourse) {
            FilteredCourse.map(course => {
                return a.push({ "courseId": course.id, "coursename": course.coursename })
            })
        }
        this.setState({ result: a });
    }

    btnSearchResult(courseId, e) {
        e.preventDefault();
        this.props.action.course.getCourseByCourseID(courseId);
        this.setState({ result: [], query: "" });
        this.props.history.push({
            pathname: '/searchData/' + courseId
        })
    }

    render() {
        const { result } = this.state;
        let searchResult = [];
        if (result && result.length > 0) {
            result.map((res, i) => {
                return searchResult.push(
                    <p key={i} style={{ cursor: "pointer" }} onClick={this.btnSearchResult.bind(this, res.courseId)}>{res.coursename}</p>
                );
            })
        }

        let token = this.props.token;
        let role = parseInt(this.props.Role);
        let categories = "";
        if (this.props.category) {
            categories = this.props.category.map(cat => {
                return <DropdownItem key={cat.id} onClick={this.onSelect.bind(this, cat.id)}>{cat.name}</DropdownItem>
            })
        }

        return (
            <div>
                <Login isOpen={this.state.LoginModal} toggle={this.toggleLogin.bind(this)} toggleModals={this.toggleLinks.bind(this)}></Login>{' '}
                <Register isOpen={this.state.RegisterModal} toggle={this.toggleRegister.bind(this)} toggleModals={this.toggleLinks.bind(this)}></Register>
                <Navbar color="light" light expand="md">
                    <img src={Logo} alt="category" className="headerimg" />
                    <NavbarBrand href="/" className="logo"><b>EduLearn</b></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav>
                            <NavItem>
                                <NavLink>
                                    <img src={category} alt="category" className="cat" height="20px" width="20px" />
                                    {' '}
                                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.DropDownToggle} className="display" >
                                        <DropdownToggle style={{ background: "white", color: " black" }} caret>Categories </DropdownToggle>
                                        <DropdownMenu>
                                            {categories}
                                        </DropdownMenu>
                                    </Dropdown>
                                </NavLink>
                            </NavItem>
                            <NavItem className="searchNav">
                                <InputGroup style={{ width: "450px", marginLeft: "10px", marginTop: "8px" }}>
                                    <Input placeholder="Search For Course" onChange={this.handleInputChange.bind(this)} value={this.state.query} />
                                    <InputGroupAddon addonType="append"> <img src={search} alt="category" className="searchIcon" /></InputGroupAddon>
                                </InputGroup>
                                <div className="searchResult">
                                    {searchResult}
                                </div>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/">
                                    {(token && role === 1) ? <Button color="danger" outline onClick={this.btnMyCourse.bind(this)}>My Courses</Button> : ""}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/">
                                    {token ? <Button color="danger" outline onClick={this.btnBoughtCourse.bind(this)}>Bought Course</Button> : ""}
                                </NavLink>
                            </NavItem>
                            <NavItem className="navItem">
                                <NavLink href="/" className="navLink">
                                    <img src={cart} alt="Cart" className="cartimage" onClick={this.btnCart.bind(this)} />
                                    {this.props.token ?
                                        <span className="totalcart">
                                            <b>{this.props.getCart.length}</b>
                                        </span> :
                                        <span className="totalcart">
                                            <b>{cartTotal}</b>
                                        </span>
                                    }
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                {!token ?
                                    (<div className="marginLogin" >
                                        <Button outline onClick={this.toggleLogin}> Log In</Button>{' '}
                                        <Button color="danger" onClick={this.toggleRegister}>Sign Up</Button></div>) :
                                    (<div>
                                        <Dropdown isOpen={this.state.ddlogoutopen} toggle={this.DropDownLogoutToggle} className="ddlogout">
                                            <DropdownToggle style={{ background: "white", color: " black", marginTop: "8px" }} caret>{this.props.Name} </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={this.btnLogout.bind(this)}>LogOut</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>)
                                }
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        category: state.category.category,
        Name: state.auth.Name,
        token: state.auth.token,
        Role: state.auth.Role,
        getCart: state.cart.getCart,
        userId: state.auth.userId,
        totalCart: state.cart.totalCart,
        course: state.course.course,
        getCourse: state.course.getCourseByCid
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        category: bindActionCreators(catAction, dispatch),
        auth: bindActionCreators(authAction, dispatch),
        cart: bindActionCreators(cartAction, dispatch),
        course: bindActionCreators(courseAction, dispatch)
    }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));