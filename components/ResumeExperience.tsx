import { EXPERIENCES } from '@/lib/resume';
import GlassReveal from './animation/GlassReveal';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeExperience() {
  return (
    <div id="experience" className="resume-section-alt">
      <div className="resume-section-alt-inner">
        <div className="section-header">
          <div className="section-num">02</div>
          <h2 className="section-title"><WordsPullUp text="Experience" /></h2>
        </div>

        {EXPERIENCES.map((exp) => (
          <GlassReveal key={exp.company} className="exp-row">
            <div>
              <div className="exp-company-name">{exp.company}</div>
              <div className="exp-meta">{exp.location}</div>
              <div className="exp-meta">{exp.span}</div>
            </div>
            <div>
              {exp.roles.map((role, j) => (
                <div key={j} className="exp-role">
                  <div className="exp-role-header">
                    <div className="exp-role-title">{role.title}</div>
                    <div className="exp-role-dates">{role.dates}</div>
                  </div>
                  {role.bullets.map((bullet, k) => (
                    <div key={k} className="exp-bullet">
                      <span className="exp-bullet-dot">—</span>
                      <span className="exp-bullet-text">{bullet}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </GlassReveal>
        ))}
      </div>
    </div>
  );
}
