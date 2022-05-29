import React from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
} from './NavbarElements';

const Navbar = () => {
return (
	<>
	<Nav>
		<Bars />

		<NavMenu>
			<NavLink to='/' activeStyle>Login</NavLink>
            <NavLink to='/home' activeStyle>Home</NavLink>
            <NavLink to='/notes' activeStyle>Notes</NavLink>
            <NavLink to='/contacts' activeStyle>Contacts</NavLink>
            <NavLink to='/about' activeStyle>About Us</NavLink>
		</NavMenu>
		{/* <NavBtn>
		<NavBtnLink to='/signin'>Sign In</NavBtnLink>
		</NavBtn> */}
	</Nav>
	</>
);
};

export default Navbar;
