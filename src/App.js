import React, { Component } from 'react';
import './App.css';
import { Table, InputGroup, InputGroupAddon, Input, Row, Col, Container } from 'reactstrap';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      news: [],
      feedUrl: 'http://api.massrelevance.com/MassRelDemo/kindle.json',
      nPosts: 5,
      updateInterval: 4
    }
    this.onNPostChange = this.onNPostChange.bind(this);
    this.onUrlChange = this.onUrlChange.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.startTimer()
  }

  componentWillMount() {
    this.getNews()
  }

  startTimer() {
    this.timer = setInterval(() => this.getNews(), this.state.updateInterval * 60000);
  }

  getNews() {
    fetch(this.state.feedUrl)
      .then(response => response.json())
      .then(responseJson => {
        this.saveNArrayElements(responseJson);
      }).catch(err=>
        this.setState({news:[]}))
  }

  saveNArrayElements(array) {
    var tempData = [];
    var n = 0;
    if (this.state.nPosts > array.length) n = array.length
    else n = this.state.nPosts
    for (let index = 0; index < n; index++) {
      var element = {
        date: array[index].created_at,
        user: array[index].user.name,
        messagge: array[index].text
      }
      tempData.push(element);
    }
    this.setState({ news: tempData });
  }

  onUrlChange(event) {
    this.setState({ feedUrl: event.target.value });
  }

  onNPostChange(event) {
    this.setState({ nPosts: event.target.value }, function () {
      if (this.state.nPosts !== undefined && this.state.nPosts > 0) {
        this.getNews()
      } else {
        this.setState({ news: [] })
      }
    });
  }

  onIntervalChange(event) {
    this.setState({ updateInterval: event.target.value }, function () {
      clearInterval(this.timer);
      if (this.state.updateInterval !== undefined && this.state.updateInterval > 0) {
        this.startTimer();
      }
    });
  }
  
  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <Col md="4">
              <Col md="12"> <h5>Feed URL</h5></Col>
              <Col md="12">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">URL</InputGroupAddon>
                  <Input type="text" value={this.state.feedUrl} onChange={this.onUrlChange}></Input>
                </InputGroup>
              </Col>
            </Col>
            <Col md="4">
              <Col md="12"> <h5>Number of posts to display</h5></Col>
              <Col md="12">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">#</InputGroupAddon>
                  <Input type="number" value={this.state.nPosts} onChange={this.onNPostChange}></Input>
                </InputGroup>
              </Col>

            </Col>
            <Col md="4">
              <Col md="12"> <h5>Update interval</h5></Col>
              <Col md="12">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">min</InputGroupAddon>
                  <Input type="number" value={this.state.updateInterval} onChange={this.onIntervalChange}></Input>
                </InputGroup>
              </Col>
            </Col>
          </Row>
        </Container>
        <Container>
          <br></br>
          <Table striped hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>User Name</th>
                <th>Messagge</th>
              </tr>
            </thead>
            <tbody>
                {
                  this.state.news.map(element => {
                    var d = new Date(element.date);
                    var dformat = [
                      d.getDate(), d.getMonth() + 1,
                      d.getFullYear()].join('/') + ' ' +
                      [d.getHours(),
                      d.getMinutes()
                      ].join(':');
                    return (
                      <tr>
                        <td>{dformat}</td>
                        <td>{element.user}</td>
                        <td>{element.messagge}</td>
                      </tr>
                    )
                  })
                }
            
            </tbody>

          </Table>

        </Container>
      </div>
    );
  }
}

export default App;
