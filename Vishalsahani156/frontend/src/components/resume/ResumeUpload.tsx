import type { ChangeEvent, DragEvent } from 'react'
import { useRef, useState } from 'react'
import { getResumeFileType } from '../../utils/resumeParser'

interface ResumeUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  disabled?: boolean
}

export function ResumeUpload({ onFileSelect, selectedFile, disabled }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validateAndSelect(file: File) {
    if (!getResumeFileType(file)) {
      setError('Only PDF and DOCX files are supported.')
      return
    }
    setError(null)
    onFileSelect(file)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) validateAndSelect(file)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    if (disabled) return
    const file = event.dataTransfer.files?.[0]
    if (file) validateAndSelect(file)
  }

  return (
    <section className="resume-card">
      <h2>Resume Upload</h2>
      <p className="resume-card-subtitle">Upload your resume as PDF or DOCX for ATS analysis.</p>

      <div
        className={`upload-dropzone${dragOver ? ' upload-dropzone--active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={handleInputChange}
          disabled={disabled}
        />
        <div className="upload-icon">↑</div>
        <p className="upload-title">
          {selectedFile ? selectedFile.name : 'Drag & drop your resume here'}
        </p>
        <p className="upload-hint">or click to browse · PDF, DOCX · max 5 MB</p>
      </div>

      {error ? <p className="upload-error">{error}</p> : null}
      {selectedFile ? (
        <p className="upload-selected">
          Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
        </p>
      ) : null}
    </section>
  )
}
