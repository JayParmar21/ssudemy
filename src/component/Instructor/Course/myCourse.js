import React, { Component } from 'react';
import { Button, Container, Media } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Popconfirm } from 'antd';

import 'antd/dist/antd.css';

import * as courseAction from '../../../action/CourseAction';
import path from '../../../path';

class MyCourse extends Component {
    componentDidMount() {
        this.props.action.course.getCourseByUID(this.props.userId);
    }

    btnNewCourse(e) {
        e.preventDefault();
        this.props.history.push('/addCourse');
    }

    btnAddChapter(courseId, e) {
        e.preventDefault();
        this.props.history.push({
            pathname: '/addChapter/' + courseId
        })
    }

    btnExplore(courseId, e) {
        this.props.history.push({
            pathname: '/exploreCourse/' + courseId
        })
    }

    btnEdit(courseId, e) {
        e.preventDefault();
        this.props.history.push({
            pathname: '/addCourse/' + courseId
        })
    }

    btnDelete(courseId, e) {
        this.props.action.course.deleteCourse(courseId);
    }

    renderMedia(course) {
        return (
            <div key={course.id} className="div2">
                <Media className="block-example border border-grey"  >
                    <Media left>
                        <Media object src={path + "thumbnail/" + course.courseImage} alt="Course" />
                    </Media>
                    <Media body className="mbody">
                        <Media heading>{course.coursename}</Media>
                        <Button color="danger" onClick={this.btnAddChapter.bind(this, course.id)}>Add Chapter</Button>
                    </Media>
                    <Media right>
                        <Button className="btnmycourse" outline onClick={this.btnExplore.bind(this, course.id)}>Explore</Button>
                        <Popconfirm title="Are you sure you want to remove your course?" okText="Yes" cancelText="No" onConfirm={this.btnDelete.bind(this, course.id)}>
                            <Button className="btnmycourse" outline>Delete</Button>
                        </Popconfirm>
                        <Button className="btnmycourse" outline onClick={this.btnEdit.bind(this, course.id)}>Edit</Button>
                    </Media>
                </Media>
            </div>
        )
    }

    render() {
        let courseList = [];
        if (this.props.coursebyuser) {
            this.props.coursebyuser.map(course => {
                return courseList.push(this.renderMedia(course))
            })
        }
        return (
            <div>
                <h3 className="marginTop">My Courses</h3>
                <Container>
                    <Button color="danger" className="btnnewcourse" outline onClick={this.btnNewCourse.bind(this)}>New Course</Button>
                </Container>
                <br />
                <Container className="cnt">
                    {courseList.length !== 0 ? courseList : <p>You didn't add your course uptil now!!! Add your Course</p>}
                </Container>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        coursebyuser: state.course.coursebyuser,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        course: bindActionCreators(courseAction, dispatch),
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MyCourse);