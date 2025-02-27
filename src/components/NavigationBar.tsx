import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>8020Fit</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/onboarding-quiz">
            <Nav.Link>Onboarding Quiz</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/fitness-dashboard">
            <Nav.Link>Fitness Dashboard</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/ai-chatbot">
            <Nav.Link>AI Chatbot</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/settings">
            <Nav.Link>Settings</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
