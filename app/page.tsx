import ResumeNav from '@/components/ResumeNav';
import ResumeHero from '@/components/ResumeHero';
import CredentialStrip from '@/components/CredentialStrip';
import ResumeSummary from '@/components/ResumeSummary';
import ResumeExperience from '@/components/ResumeExperience';
import ResumeSkills from '@/components/ResumeSkills';
import ResumeEducation from '@/components/ResumeEducation';
import ResumeFooter from '@/components/ResumeFooter';

export default function ResumePage() {
  return (
    <>
      <ResumeNav />
      <ResumeHero />
      <CredentialStrip />
      <ResumeSummary />
      <ResumeExperience />
      <ResumeSkills />
      <ResumeEducation />
      <ResumeFooter />
    </>
  );
}
