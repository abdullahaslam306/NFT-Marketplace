import React, { Component } from "react";
// To use Drag and drop for file uploading You need to pass TWO props to the component
// 1. RenderProp: A function that returns a component that will be rendered
// 2. handleDrop: A function that will be called when the file is dropped
// And CHILDREN: A component that will be rendered inside the renderProp function (<DragAndDrop> ANY PRESENTATION COMPONENT </DragAndDrop>)
class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drag: false,
    };
    this.dragCounter = 0;
  }
  dropRef = React.createRef();
  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  };
  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({ drag: false });
    }
  };
  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };
  dragCounter;
  componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }
  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }
  render() {
    const { RenderProp } = this.props;
    return (
      <div
        style={{ display: "inline-block", position: "relative" }}
        ref={this.dropRef}
      >
        <RenderProp dragging={this.state.drag} />
        {this.props.children}
      </div>
    );
  }
}
export default DragAndDrop;
