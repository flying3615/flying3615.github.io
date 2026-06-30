import Nav from '@/components/Nav';
import ResumeHero from '@/components/ResumeHero';
import CredentialStrip from '@/components/CredentialStrip';
import ResumeSummary from '@/components/ResumeSummary';
import ResumeExperience from '@/components/ResumeExperience';
import ResumeSkills from '@/components/ResumeSkills';
import ResumeEducation from '@/components/ResumeEducation';
import WorkList from '@/components/WorkList';
import ResumeFooter from '@/components/ResumeFooter';

export default function ResumePage() {
  return (
    <>
      <Nav />
      <ResumeHero />
      <CredentialStrip />
      <ResumeSummary />
      <ResumeExperience />
      <ResumeSkills />
      <ResumeEducation />
      <WorkList />
      <ResumeFooter />
    </>
  );
}
