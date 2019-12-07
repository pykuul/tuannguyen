import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";

class MenuDrop extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    options: PropTypes.arrayOf(String)
  };

  state = {
    open: false,
    anchorE1: undefined
  };

  button = undefined;

  handleClick = event => {
    this.setState({ open: true, anchorE1: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { options, src, alt } = this.props;

    return (
      <div>
        <Avatar
          role="presentation"
          aria-owns="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          src={src}
          alt={alt}
          style={{ margin: "0px 20px 0px auto", cursor: "pointer" }}
        />
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorE1}
          open={this.state.open}
          onClose={this.handleClose}
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
  }
}

export default MenuDrop;
