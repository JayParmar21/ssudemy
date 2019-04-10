import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import * as VideoAction from '../../../action/addVideoAction';

class AddVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            videoUploaded: false,
            videoValidMsg: ""
        };
        this.onVideoUpload = this.onVideoUpload.bind(this);
    }

    onVideoUpload(e) {
        let videos = [];
        let length = e.target.files.length;
        for (let i = 0; i < length; i++) {
            videos.push(e.target.files[i]);
        }
        this.setState({
            videos: videos,
            videoUploaded: true,
            videoValidMsg: ""
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ videoValidMsg: prevProps.videoValidMsg })
        }
    }

    onAdd(e) {
        e.preventDefault();
        const formData = new FormData();
        for (var i = 0; i < this.state.videos.length; i++) {
            formData.append('name', this.state.videos[i]);
        }
        formData.append('courseId', this.props.courseId);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        if (this.state.videoUploaded && this.state.videos.length !== 0) {
            this.props.action.video.addVideo(formData, config);
            this.props.toggle();
        }
        else {
            this.setState({ videoValidMsg: "Please select video!!" })
        }

    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Add videos</ModalHeader>
                <ModalBody>
                    <input type="file" onChange={this.onVideoUpload} multiple />
                </ModalBody>
                {this.state.videoValidMsg ? <center><span style={{ color: "red" }} > {this.state.videoValidMsg}</span></center> : ""}
                <ModalFooter>
                    <Button color="danger" onClick={this.onAdd.bind(this)}>Upload</Button>{' '}
                    <Button outline onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        video: bindActionCreators(VideoAction, dispatch),
    }
})

export default connect(null, mapDispatchToProps)(AddVideo);