export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-rule" />
      <p className="footer-text">
        © {new Date().getFullYear()} The Chronicle &nbsp;·&nbsp; Powered by AI &nbsp;·&nbsp; All rights reserved
      </p>
    </footer>
  )
}
