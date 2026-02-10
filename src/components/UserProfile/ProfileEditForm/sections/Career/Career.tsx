import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeUpload } from '../ResumeUpload';
import { EducationSection } from '../EducationSection';
import { WorkExperienceSection } from '../WorkExperienceSection';
import { SkillsSection } from '../SkillsSection';

interface CareerSectionProps {
  data: {
    education: any[];
    experience: any[];
    skills: any[];
    resumeUrl?: string;
  };
  onChange: (field: string, value: any) => void;
}

export function Career({ data, onChange }: CareerSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResumeUpload
            currentResumeUrl={data.resumeUrl}
            onResumeChange={(file) => {
              if (file) {
                const fakeUrl = URL.createObjectURL(file);
                onChange('resumeUrl', fakeUrl);
              } else {
                onChange('resumeUrl', null);
              }
            }}
          />
        </CardContent>
      </Card>

      <EducationSection
        education={data.education || []}
        onEducationChange={(education) => onChange('education', education)}
      />

      <WorkExperienceSection
        experience={data.experience || []}
        onExperienceChange={(experience) => onChange('experience', experience)}
      />

      <SkillsSection
        skills={data.skills || []}
        onSkillsChange={(skills) => onChange('skills', skills)}
      />
    </div>
  );
}