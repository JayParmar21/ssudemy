import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Container, Media } from 'reactstrap';
import { Rate } from 'antd';
import 'antd/dist/antd.css';

import path from '../../path';
import * as cartAction from '../../action/cartAction';
import * as ratingsAction from '../../action/ratingsAction';
import '../../styling.css';
class BoughtCourse extends Component {

    componentDidMount() {
        if (this.props.token && this.props.userId) {
            this.props.action.cart.getBoughtCourseByUser(parseInt(this.props.userId));
            this.props.action.rate.getRatings(parseInt(this.props.userId))
        }
    }

    ratings(courseId, value, e) {
        let data = {
            userId: parseInt(this.props.userId),
            courseId: courseId,
            ratings: value
        }
        this.props.action.rate.addRatings(data);
    }

    explore(courseId, e) {
        e.preventDefault();
        this.props.history.push({
            pathname: '/exploreCourse/' + courseId
        })
    }

    renderMedia(course) {
        let rates = [];
        let rateFound = false;
        let keycnt = 0;
        if (this.props.ratings) {
            this.props.ratings.map((rate, i) => {
                if (rate.courseId === course.courseId) {
                    rateFound = true;
                    rates.push(
                        <Rate key={i} allowHalf defaultValue={rate.ratings} className="ratings" onChange={this.ratings.bind(this, course.courseId)} />
                    )
                }
                return null
            })
            if (!rateFound) {
                keycnt = keycnt + 1;
                rates.push(
                    <Rate key={keycnt} allowHalf className="ratings" onChange={this.ratings.bind(this, course.courseId)} />
                )
            }
        }


        return (
            <div key={course.id} className="div2">
                <Media className="block-example border border-grey"  >
                    <Media left>
                        <Media object src={path + "thumbnail/" + course.courseImage} alt="Course" />
                    </Media>
                    <Media body className="mediaBody" onClick={this.explore.bind(this, course.courseId)}>
                        <Media heading >{course.coursename}</Media>
                        <Media>{course.description}</Media>
                    </Media>
                    <Media right className="marginRates">
                        <span><i>Rate it: </i></span>
                        {rates}
                    </Media>
                </Media>
            </div >
        )
    }

    render() {
        let buyCourse = [];
        if (this.props.boughtCourse) {
            this.props.boughtCourse.map(course => {
                return buyCourse.push(this.renderMedia(course))
            })
        }
        return (
            <div>
                <h3 className="marginTop">Bought Courses</h3>
                <Container className="container">
                    {buyCourse.length !== 0 ? buyCourse : <p>Yet Not bought anything. Explore and buy your course</p>}
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        boughtCourse: state.cart.boughtCourse,
        token: state.auth.token,
        ratings: state.ratings.ratings
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        cart: bindActionCreators(cartAction, dispatch),
        rate: bindActionCreators(ratingsAction, dispatch),
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(BoughtCourse);