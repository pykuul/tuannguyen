import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const Header = (props) => {
  debugger;
  return (
    <>
      <Link href="/">
        <a style={linkStyle}>Home</a>
      </Link>
      <Link href='/about'>
        <a style={linkStyle}>About me</a>
      </Link>
      <Link href='/blogs'>
        <a style={linkStyle}>Blogs</a>
      </Link>
      <Link href='/cv'>
        <a style={linkStyle}>CV</a>
      </Link>
      <Link href='/portfolios'>
        <a style={linkStyle}>Portfolios</a>
      </Link>
    </>
  )
}

export default Header;