import PropTypes from 'prop-types'
import Button from './Button'
import React from "react"

const Header = ({title, buttonText}) => {
    return(
        <header className="header">
            <h1>{title}</h1>
            {/* <Button color="green" text={buttonText}/> */}
        </header>
    )
}

Header.defaultProps = {
    title: 'Header',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

export default Header