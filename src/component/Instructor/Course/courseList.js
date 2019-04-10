import React, { Component } from 'react';
import { Button, Container, Media } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Rate, notification } from 'antd';
import 'antd/dist/antd.css';

import * as courseAction from '../../../action/CourseAction';
import * as cartAction from '../../../action/cartAction';
import path from '../../../path';

class CourseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageModal: false,
            videoModal: false,
            courseId: 0,
            visible: false
        };
        this.toggleImage = this.toggleImage.bind(this);
        this.toggleVideo = this.toggleVideo.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount() {
        if (this.props.token && this.props.userId) {
            this.props.action.cart.getCartByUser(parseInt(this.props.userId))
            this.props.action.cart.getBoughtCourseByUser(parseInt(this.props.userId));
        }
        this.props.action.course.getCourse();
    }

    toggleImage(courseId, e) {
        this.setState(prevState => ({
            imageModal: !prevState.imageModal,
            courseId: courseId
        }));
    }

    onDismiss() {
        this.setState({ visible: !this.state.visible });
    }

    toggleVideo(courseId, e) {
        this.setState(prevState => ({
            videoModal: !prevState.videoModal,
            courseId: courseId
        }));
    }

    btnNewCourse(e) {
        e.preventDefault();
        this.props.history.push('/addCourse');
    }

    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };

    btnAddToCart(courseId, e) {
        let cartData = [];
        let data = {
            userId: parseInt(this.props.userId),
            courseId: courseId
        }
        if (this.props.token) {
            this.props.action.cart.addToCart(data);
        }
        else {
            cartData = JSON.parse(localStorage.getItem("cart"));
            if (cartData === null) {
                cartData = [];
            }
            cartData.push({ courseId: courseId });
            localStorage.setItem("cart", JSON.stringify(cartData));
        }
        this.openNotificationWithIcon('success', "Successfully added to cart");
    }

    btnExplore(courseId, e) {
        this.props.history.push({
            pathname: '/exploreCourse/' + courseId
        })
    }

    btnGoCart(e) {
        this.props.history.push('/cart');
    }

    renderMedia(course) {
        let addedToCart = true;
        let loginCart = true;
        let bought = false;
        let boughtCourseId = [];
        let userId = parseInt(this.props.userId);

        if (this.props.token) {
            if (this.props.boughtCourse && this.props.boughtCourse.length !== 0) {
                this.props.boughtCourse.map(boughtcourse => {
                    return boughtCourseId.push(boughtcourse.courseId);
                })
            }
            if (userId === course.userId) {
                bought = true;
            }
            else if (boughtCourseId.includes(course.id)) {
                bought = true;
            }
            else if (this.props.getCart && this.props.getCart.length !== 0) {
                this.props.getCart.map(cart => {
                    if (cart.courseId === course.id) {
                        return addedToCart = false;
                    }
                    return null
                })
            }
        }
        else if (localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart")).length !== 0) {
            let carts = JSON.parse(localStorage.getItem("cart"));
            let cid = [];
            carts.map(c => {
                return cid.push(c.courseId)
            });
            for (let i = 0; i < cid.length; i++) {
                if (cid[i] === course.id) {
                    loginCart = false;
                }
            }
        }

        return (
            <div key={course.id} className="div2">
                <Media className="block-example border border-grey"  >
                    <Media left>
                        <Media object src={path + "thumbnail/" + course.courseImage} alt="Course" />
                    </Media>
                    <Media body className="mediab">
                        <Media heading>{course.coursename}</Media>
                        <Rate allowHalf defaultValue={course.ratings} disabled />
                    </Media>
                    <Media right>
                        <Button className="mar" outline onClick={this.btnExplore.bind(this, course.id)}>Explore</Button>
                        {bought ? "" :
                            ((addedToCart && loginCart) ?
                                <Button className="addCart" outline onClick={this.btnAddToCart.bind(this, course.id)} >Add To Cart</Button>
                                : <Button className="addCart" outline onClick={this.btnGoCart.bind(this)}>Go to Cart</Button>)
                        }

                    </Media>
                </Media>
            </div >
        )
    }

    render() {
        let courseList = [];
        if (this.props.course) {
            this.props.course.map(course => {
                return courseList.push(this.renderMedia(course))
            })
        }
        return (
            <div>
                <h3 className="marginTop">Courses</h3>
                <Container className="container">
                    {courseList}
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        course: state.course.course,
        userId: state.auth.userId,
        getCart: state.cart.getCart,
        boughtCourse: state.cart.boughtCourse
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        course: bindActionCreators(courseAction, dispatch),
        cart: bindActionCreators(cartAction, dispatch),
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseList);