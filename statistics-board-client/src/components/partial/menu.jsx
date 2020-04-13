import React from 'react'
import { NavLink } from 'react-router-dom'

const Menu = () => (
  <div className={`topnav`}>
    <ul style={{ userSelect: 'none' }}>
      <li className="link">
        <NavLink className="text_link" exact activeClassName="active" to="/">Home</NavLink>
      </li>
      <li className="link">
        <NavLink className="text_link" activeClassName="active" to="/statistics">Statistics</NavLink>
      </li>
    </ul>
  </div>
);

export default Menu
