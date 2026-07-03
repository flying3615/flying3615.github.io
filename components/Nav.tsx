import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">Yufei Liu</Link>
      <div className="nav-links">
        <a href="#work">Work</a>
        <Link href="/">Resume</Link>
        <a href="mailto:gabriel.liu3615@gmail.com">Contact</a>
      </div>
    </nav>
  );
}
