import React, { Component } from "react";
import { Card, Row, Col, CardBody, CardTitle, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { Rate } from 'antd';
import 'antd/dist/antd.css';

import path from '../../path';
import '../../styling.css'

class CourseByCID extends Component {

    btnBack(e) {
        e.preventDefault();
        this.props.history.push('/courseList');
    }

    btnExplore(courseId, e) {
        e.preventDefault();
        this.props.history.push({
            pathname: '/exploreCourse/' + courseId
        })
    }

    renderCard = (course) => {
        return (
            <Col sm="2" key={course.id} className="column">
                <Card className="card">
                    <CardBody style={{ padding: "0px" }}>
                        <img className="imgCard" src={path + "courseImage/" + course.courseImage} alt="Card cap" />
                        <CardTitle><b> {course.coursename}</b> </CardTitle>
                        <Rate allowHalf defaultValue={course.ratings} disabled />
                    </CardBody>
                    <CardBody>
                        <Button color="danger" onClick={this.btnExplore.bind(this, course.id)} >Explore Course</Button>
                    </CardBody>
                </Card>
            </Col >
        );
    };
    render() {
        let courseList = [];
        let category = "";
        if (this.props.courses) {
            this.props.courses.map(courses => {
                category = courses.category;
                return courseList.push(this.renderCard(courses))
            })
        }
        return (
            <div>
                <Row>
                    <Button className="btnBack" onClick={this.btnBack.bind(this)}>Back</Button>
                </Row>
                <Row>
                    <h3 className="Btnstyle">{category}</h3>
                </Row>
                {this.props.error_msg ?
                    <h3>Not yet added</h3> :
                    <Row sm="4">
                        {courseList}
                    </Row>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        error_msg: state.category.error_msg,
        courses: state.category.courses,
    }
}

export default connect(mapStateToProps, null)(CourseByCID);