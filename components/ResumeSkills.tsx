import { CORE_SKILLS, AI_SKILLS, CERTIFICATIONS } from '@/lib/resume';
import GlassReveal from './animation/GlassReveal';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeSkills() {
  return (
    <div id="skills" className="resume-section">
      <div className="section-header">
        <div className="section-num">03</div>
        <h2 className="section-title"><WordsPullUp text="Skills" /></h2>
      </div>

      <div className="skills-cols">
        <GlassReveal>
          <div className="skill-category-label">Core Stack</div>
          <div className="skill-tags">
            {CORE_SKILLS.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>

          <div className="skill-category-label skill-category-label--gap">AI &amp; Agentic</div>
          <div className="skill-tags">
            {AI_SKILLS.map((s) => (
              <span key={s} className="skill-tag skill-tag--ai">{s}</span>
            ))}
          </div>
        </GlassReveal>

        <GlassReveal>
          <div className="skill-category-label">Certifications</div>
          <div className="cert-list">
            {CERTIFICATIONS.map((c, i) => (
              <div key={i} className="cert-item">
                <span className="cert-plus">+</span>
                <span className="cert-text">{c}</span>
              </div>
            ))}
          </div>
        </GlassReveal>
      </div>
    </div>
  );
}
