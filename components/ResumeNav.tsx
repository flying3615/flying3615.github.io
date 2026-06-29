import Link from 'next/link';

export default function ResumeNav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">YUFEI LIU</Link>
      <div className="nav-links resume-nav-links">
        <a href="#summary">Summary</a>
        <a href="#experience">Experience</a>
        <a href="#skills">Skills</a>
        <a href="#education">Education</a>
        <Link href="/projects">Projects</Link>
      </div>
    </nav>
  );
}
