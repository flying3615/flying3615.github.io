import { EDUCATION } from '@/lib/resume';
import StaggerCard from './animation/StaggerCard';
import WordsPullUp from './animation/WordsPullUp';

export default function ResumeEducation() {
  return (
    <div id="education" className="resume-section-alt">
      <div className="resume-section-alt-inner">
        <div className="section-header">
          <div className="section-num">04</div>
          <h2 className="section-title"><WordsPullUp text="Education" /></h2>
        </div>

        {EDUCATION.map((edu, i) => (
          <StaggerCard key={edu.school} index={i} className="edu-row">
            <div className="edu-years">{edu.years}</div>
            <div>
              <div className="edu-school">{edu.school}</div>
              <div className="edu-degree">{edu.degree}</div>
            </div>
          </StaggerCard>
        ))}
      </div>
    </div>
  );
}
