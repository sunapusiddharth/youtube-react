import React from 'react';
import {Form, Icon, Image, Input, Menu} from 'semantic-ui-react';
import './HeaderNav.scss';
import logo from '../../assets/images/logo.jpg';
import {Link,withRouter} from 'react-router-dom'

export class HeaderNav extends React.Component {
  //we store the curren t string the user entered into our text field
  constructor(props){
    super(props)
    this.state={
      query:'',
    }
  }

  //event handler when user enters something in the query 
  onInputChange = (event)=>{
    this.setState({
      query:event.target.value
    })
  }

  //event handler for submit 
  onSubmit  =()=>{
    const escapedSearchQuery = encodeURI(this.state.query)
    this.props.history.push(`/results?search_query=${escapedSearchQuery}`)
  }

  render() {
    return (
      <Menu borderless className='top-menu' fixed='top'>
        <Menu.Item header className='logo'>
            <Link to="/">
              <Image src={logo} size='tiny'/>
            </Link>
        </Menu.Item>
        <Menu.Menu className='nav-container'>
          <Menu.Item className='search-input'>
            <Form onSubmit={this.onSubmit}>
              <Form.Field>
                <Input placeholder='Search'
                       size='small'
                       action='Go'
                       value={this.state.query}
                       onChange={this.onInputChange}
                />
              </Form.Field>
            </Form>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Icon className='header-icon' name='video camera' size='large'/>
            </Menu.Item>
            <Menu.Item>
              <Icon className='header-icon' name='grid layout' size='large'/>
            </Menu.Item>
            <Menu.Item>
              <Icon className='header-icon' name='chat' size='large'/>
            </Menu.Item>
            <Menu.Item>
              <Icon className='header-icon' name='alarm' size='large'/>
            </Menu.Item>
            <Menu.Item name='avatar'>
              <Image src='http://via.placeholder.com/80x80' avatar/>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withRouter(HeaderNav);
//we have added the withRouter handler to pass in the location data so that we have access
//to it when we redirect the user 
