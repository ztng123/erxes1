
const React = require('react');
const year = new Date().getFullYear();
const urlLink = "https://erxes.io";

class Footer extends React.Component {
  render() {
	return (
		<footer className="footer">
			<hr/>
			<p> © Copyright {year} <a className="footerLink" href={urlLink} target="_blank">Erxes Inc</a> </p>
		</footer>
	);
  }
}

module.exports = Footer;
