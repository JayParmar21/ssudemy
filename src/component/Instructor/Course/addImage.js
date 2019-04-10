import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import * as ImageAction from '../../../action/addImageAction';

class AddImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            imageUploaded: false,
            imageValidMsg: ""
        };
        this.onImageUpload = this.onImageUpload.bind(this);
    }

    onImageUpload(image) {
        this.setState({
            images: this.state.images.concat(image),
            imageUploaded: true,
            imageValidMsg: ""
        });
    }

    onAdd(e) {
        e.preventDefault();
        const formData = new FormData();
        for (var i = 0; i < this.state.images.length; i++) {
            formData.append('name', this.state.images[i]);
        }
        formData.append('courseId', this.props.courseId);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };


        if (this.state.imageUploaded && this.state.images.length !== 0) {
            this.props.action.image.addImage(formData, config);
            this.props.toggle();
        }
        else {
            this.setState({ imageValidMsg: "Please select image!!" })
        }

    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>Add Images</ModalHeader>
                    <ModalBody>
                        <ImageUploader
                            withIcon={true}
                            buttonText='Select Images'
                            onChange={this.onImageUpload}
                            imgExtension={['.jpg', 'jpeq', '.png']}
                            maxFileSize={5242880}
                            withPreview={true}
                            withLabel={false}
                        />
                        {this.state.imageValidMsg ? <span style={{ color: "red" }} > {this.state.imageValidMsg}</span> : ""}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.onAdd.bind(this)}>Upload</Button>{' '}
                        <Button outline onClick={this.props.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        image: bindActionCreators(ImageAction, dispatch),
    }
})

export default connect(null, mapDispatchToProps)(AddImage);