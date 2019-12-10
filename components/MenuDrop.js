import { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";

const MenuDrop = props => {
  // define component state
  const [state, setState] = useState({
    open: false,
    anchorE1: undefined
  });

  // const button = undefined;

  const handleClick = event => {
    setState({ open: true, anchorE1: event.currentTarget });
  };

  const handleClose = () => {
    setState({ open: false });
  };

  const { options, src, alt } = props;

  return (
    <div>
      <Avatar
        role="presentation"
        aria-owns="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        onKeyPress={handleClick}
        src={src}
        alt={alt}
        style={{ margin: "0px 20px 0px auto", cursor: "pointer" }}
      />
      <Menu
        id="simple-menu"
        anchorEl={state.anchorE1}
        open={state.open}
        onClose={handleClose}
        keepMounted
      >
        <p />
        {options.map(option => (
          <div id="wrappingLink" key={option.text}>
            <Link href={option.href} as={option.as || option.href}>
              <a style={{ padding: "0px 20px" }}>{option.text}</a>
            </Link>
            <p />
          </div>
        ))}
      </Menu>
    </div>
  );
};

MenuDrop.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  options: PropTypes.arrayOf(String)
};

export default MenuDrop;
