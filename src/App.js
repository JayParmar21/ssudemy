import React, { Component } from 'react';
import { Switch, withRouter } from 'react-router-dom';
import './App.css';
import CRoute from './component/CustomRoute/customRoute';
import Header from './component/Header/header';
import HomePage from './component/HomePage/homePage';
import AddCourse from './component/Instructor/Course/addCourse';
import CourseList from './component/Instructor/Course/courseList';
import CourseByCID from './component/CourseByCatID/CourseByCatID';
import ExploreCourse from "./component/CourseByCatID/ExploreCourse";
import MyCourse from './component/Instructor/Course/myCourse';
import Cart from "./component/Cart/myCart";
import BoughtCourse from "./component/BoughtCourse/boughtCourse";
import AddChapter from "./component/Instructor/Course/addChapter";
import SearchDisplay from "./component/Search/SearchDisplay";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <CRoute path="/" exact component={HomePage} />
          <CRoute path="/addCourse/:courseId?" exact component={AddCourse} />
          <CRoute path="/addChapter/:courseId" exact component={AddChapter} />
          <CRoute path="/myCourse" exact component={MyCourse} />
          <CRoute path="/courseList" exact component={CourseList} />
          <CRoute path="/courseCID" exact component={CourseByCID} />
          <CRoute path="/cart" exact component={Cart} />
          <CRoute path="/boughtCourse" exact component={BoughtCourse} />
          <CRoute path="/searchData/:courseId" exact component={SearchDisplay} />
          <CRoute path="/exploreCourse/:courseId" exact component={ExploreCourse} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
