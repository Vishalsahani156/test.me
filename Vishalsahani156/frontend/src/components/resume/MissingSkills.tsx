interface MissingSkillsProps {
  skills: string[]
}

export function MissingSkills({ skills }: MissingSkillsProps) {
  return (
    <section className="resume-card">
      <h2>Missing Skills Detection</h2>
      <p className="resume-card-subtitle">
        Skills and terms from the job posting that are absent from your resume.
      </p>

      {skills.length ? (
        <ul className="missing-skills-list">
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p className="empty-note success-note">
          No major skill gaps detected for the provided job description.
        </p>
      )}
    </section>
  )
}
