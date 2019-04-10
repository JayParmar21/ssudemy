import React, { Component } from 'react';
import { Button } from 'reactstrap'

import HomeLogo from '../../assets/images/page-background.jpg';

class HomePage extends Component {
    state = {
        width: window.innerWidth,
        height: window.innerHeight - 60
    }
    handleLetsStartButton() {
        this.props.history.push('/courseList');
    }
    render() {
        return (
            <div className="hrelative">
                <img src={HomeLogo}
                    style={{
                        width: this.state.width, height: this.state.height,
                        backgroundRepeat: "no-repeat", backgroundAttachment: "fixed"
                    }}
                    alt="Home"></img>
                <center>
                    <div className="homediv">
                        <Button color="danger" style={{ color: "seashell", fontSize: "-webkit-xxx-large" }} onClick={this.handleLetsStartButton.bind(this)} outline>Let's Begin</Button>
                    </div>
                </center>
            </div>
        );
    }
}

export default HomePage;