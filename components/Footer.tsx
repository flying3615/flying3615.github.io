import Link from 'next/link';
import WordsPullUp from './animation/WordsPullUp';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-h2">
          <div><WordsPullUp text="Let's Build" /></div>
          <div><WordsPullUp text="Something" /></div>
        </h2>
        <div className="footer-contacts">
          <div>
            <div className="fc-label">Email</div>
            <a href="mailto:gabriel.liu3615@gmail.com" className="fc-value">
              gabriel.liu3615@gmail.com
            </a>
          </div>
          <div>
            <div className="fc-label">LinkedIn</div>
            <a
              href="https://www.linkedin.com/in/yufei-liu-92766a66"
              target="_blank"
              rel="noopener noreferrer"
              className="fc-value"
            >
              in/yufei-liu
            </a>
          </div>
          <div>
            <div className="fc-label">Resume</div>
            <Link href="/" className="fc-value">Full résumé →</Link>
          </div>
        </div>
        <div className="footer-bar">
          <div className="footer-name">Yufei Liu</div>
          <div className="footer-tagline">Senior Full Stack Developer · Wellington, NZ</div>
        </div>
      </div>
    </footer>
  );
}
