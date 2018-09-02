import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';


class Messages extends Component {
  constructor() {
    super();

    this.state = {
      allMessages: [],
      currentMessages: [],
      paginationNum: '',
      pageNum: 1
    }

    this.changePage = this.changePage.bind(this);
    this.compareValues = this.compareValues.bind(this);
    this.paginationFilter = this.paginationFilter.bind(this);
  }

  componentDidMount() {
    axios.get('/messages')
    .then((res) => {
      let paginationNum = Math.ceil(res.data.length / 5);

      this.setState({
        allMessages: res.data,
        paginationNum: paginationNum
      });
    }).then(() => {
      // Set the initial first 5 messages
      this.paginationFilter(1);
    })

  }

  compareValues(key, createdAt, order='asc') {
    return function(a, b) {
      // Grab the user property within message 
      if (createdAt) {
        a = a.user;
        b = b.user;
      }

      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // Property doesn't exist on either object
          return 0; 
      }
  
      // Turn key into uppercase if string
      const upperCaseKeyA = (typeof a[key] === 'string') ? 
        a[key].toUpperCase() : a[key];
      const upperCaseKeyB = (typeof b[key] === 'string') ? 
        b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (upperCaseKeyA > upperCaseKeyB) {
        comparison = 1;
      } else if (upperCaseKeyA < upperCaseKeyB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  filter(action) {
    let category = action[0];
    let createdAt = category === 'created_at' ? false : true;
    let direction = action[1];
    let sorted;
    
    if (direction === 'down') {
      sorted = this.state.allMessages.sort(this.compareValues(category, createdAt, 'desc'));
    } else {
      sorted = this.state.allMessages.sort(this.compareValues(category, createdAt));
    }

    this.setState({
      allMessages: sorted
    });

    this.paginationFilter(1);
  }

  changePage(action) {
    if (typeof action === 'string') {
      // Make sure the pageNum does not go more than paginationNum
      if (action === 'next' && this.state.pageNum < this.state.paginationNum) {
        let pageNum = this.state.pageNum + 1;
        // Run paginationFilter to show correct messages
        this.paginationFilter(pageNum);
        // Set the state to the new pageNum
        this.setState({
          pageNum: pageNum
        });
      } else if (action === 'previous' && this.state.pageNum > 1) {
        let pageNum = this.state.pageNum - 1;
        // Run paginationFilter to show correct messages
        this.paginationFilter(pageNum);
        // Set the state to the new pageNum
        this.setState({
          pageNum: pageNum
        });
      }
    } else {
      // Run the paginationFilter and pass in clicked page number
      this.paginationFilter(action)
      // Update state with new pageNum
      this.setState({
        pageNum: action
      });
    }
  } 

  paginationFilter(pageNum) {
    // Designate how many messages to show 
    let endSlice = pageNum * 5;
    // Variable for where to begin array slice
    let beginSlice = endSlice - 5;
    let selectedMessages = this.state.allMessages.slice(beginSlice, endSlice);
    console.log(selectedMessages)

    this.setState({
      currentMessages: selectedMessages
    });
  }

  render() {
    return (
      <Container>
        <div>
          <Row>
            <Col style={{'textAlign': 'center'}}>
              First Name 
              <i style={{fontWeight: '200'}} className='fas fa-arrow-alt-circle-up' onClick={() => { this.filter(['first', 'up']) }} />
              <i style={{fontWeight: '200'}} className='fas fa-arrow-alt-circle-down' onClick={() => { this.filter(['first', 'down']) }} />
            </Col>
            <Col style={{'textAlign': 'center'}}>
              Username 
              <i style={{fontWeight: '200'}} className='fas fa-arrow-alt-circle-up' onClick={() => { this.filter(['username', 'up']) }} />
              <i style={{fontWeight: '200'}} className='fas fa-arrow-alt-circle-down' onClick={() => { this.filter(['username', 'down']) }} />
            </Col>
            <Col style={{'textAlign': 'center'}}>
              Message
              <i style={{fontWeight: '200'}} className='fas fa-arrow-alt-circle-up' onClick={() => { this.filter(['created_at', 'up']) }} />
              <i style={{fontWeight: '200'}} className='fas fa-arrow-alt-circle-down' onClick={() => { this.filter(['created_at', 'down']) }} />
            </Col>
          </Row>
          {this.state.currentMessages.map((message, idx) => {
            return (
              <Row className='userAndMessage' key={idx}>
                <Col>{message.user.first}</Col>
                <Col>{message.user.username}</Col>
                <Col>{message.message}</Col>
              </Row>
            );
          })}
        </div>
        <div>
          <Pagination aria-label='messages pagination'>
            <PaginationItem>
              <PaginationLink previous onClick={() => { this.changePage('previous')}} className='previous' />
            </PaginationItem>
              {[...Array(this.state.paginationNum)].map((num, idx) => {
                let pageNum = idx + 1;

                return (
                  <div key={idx}>
                    <PaginationItem className={`paginationPage ${pageNum}`}>
                      <PaginationLink onClick={() => { this.changePage(pageNum) }}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                );
              })}
            <PaginationItem>
              <PaginationLink next onClick={() => { this.changePage('next')}} className='next' />
            </PaginationItem>
          </Pagination>
        </div>
      </Container>
    );
  }
};

export default Messages;