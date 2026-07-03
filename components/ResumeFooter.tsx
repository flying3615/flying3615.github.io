import WordsPullUp from './animation/WordsPullUp';

export default function ResumeFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-h2"><WordsPullUp text="Let's Build Something" /></h2>
        <div className="footer-contacts">
          <div className="contact-item">
            <div className="contact-label">Email</div>
            <a href="mailto:gabriel.liu3615@gmail.com" className="contact-link">gabriel.liu3615@gmail.com</a>
          </div>
          <div className="contact-item">
            <div className="contact-label">LinkedIn</div>
            <a
              href="https://www.linkedin.com/in/yufei-liu-92766a66"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              in/yufei-liu →
            </a>
          </div>
          <div className="contact-item">
            <div className="contact-label">Location</div>
            <div className="contact-link" style={{ cursor: 'default' }}>Paraparaumu, Wellington, NZ</div>
          </div>
        </div>
        <div className="footer-bar">
          <span className="footer-name">Yufei Liu</span>
          <span className="footer-tagline">Senior Full Stack Developer · Wellington, NZ</span>
        </div>
      </div>
    </footer>
  );
}
