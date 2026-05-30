interface ResumeDownloadProps {
  fileName: string
  content: string
  disabled?: boolean
}

export function ResumeDownload({ fileName, content, disabled }: ResumeDownloadProps) {
  function handleDownload() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName.replace(/\.(pdf|docx)$/i, '') + '-improved.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="resume-card download-card">
      <h2>Resume Download</h2>
      <p className="resume-card-subtitle">
        Download an improved resume draft with keyword additions and ATS suggestions applied.
      </p>
      <button
        type="button"
        className="btn-primary"
        onClick={handleDownload}
        disabled={disabled || !content.trim()}
      >
        Download improved resume
      </button>
    </section>
  )
}
