import React from 'react';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

class PostInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        title: "",
        content: "",
        timestamp: 0,
      },
      submitError: false,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTitleChange(event) {
    this.setState({
      post: Object.assign({}, this.state.post, {title: event.target.value})
    });
  }

  handleContentChange(event) {
    this.setState({
      post: Object.assign({}, this.state.post, {content: event.target.value})
    });
  }

  handleSubmit(event) {
    var now = Date.now();
    fetch('posts', {
        method: 'POST',
        body: JSON.stringify(Object.assign({}, this.state.post, {timestamp: now})),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.status !== 200) {
          this.setState({submitError: response.status})
          return;
        }

        response.json().then(data => console.log("Odpowiedź:" + data));
        window.location.reload()
      })
      .catch(error => console.log(error));
    event.preventDefault();
  }

  handleErrorAlert() {
    if (this.state.submitError) {
      return (
        <Alert variant="danger"
               dismissible
               onClose={() => this.setState({submitError: false})}>
          Nie można zapisać posta, serwer zwrócił status: {this.state.submitError}.
        </Alert>
      );
    }
  }

  render() {
    return (
      <Container className="post-input">
        {this.handleErrorAlert()}
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Tytuł</Form.Label>
            <Form.Control
              type="text"
              value={this.state.title}
              onChange={this.handleTitleChange}
              placeholder="Title" />
          </Form.Group>
          <Form.Group controlId="formContnet">
            <Form.Label>Treść</Form.Label>
            <Form.Control
              as="textarea"
              value={this.state.content}
              onChange={this.handleContentChange}
              placeholder="Enter text" />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </Form>
      </Container>
    )
  }
}

export default PostInput