import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { getResumeFileType } from '../../utils/resumeParser'

interface UploadVersionModalProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File, label: string, notes: string) => Promise<void>
}

export function UploadVersionModal({ open, onClose, onUpload }: UploadVersionModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [label, setLabel] = useState('')
  const [notes, setNotes] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  function resetForm() {
    setFile(null)
    setLabel('')
    setNotes('')
    setError(null)
    setDragOver(false)
  }

  function handleClose() {
    if (submitting) return
    resetForm()
    onClose()
  }

  function validateAndSet(nextFile: File) {
    if (!getResumeFileType(nextFile)) {
      setError('Only PDF and DOCX files are supported.')
      return
    }
    if (nextFile.size > 5 * 1024 * 1024) {
      setError('File must be 5 MB or smaller.')
      return
    }
    setError(null)
    setFile(nextFile)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0]
    if (next) validateAndSet(next)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    const next = event.dataTransfer.files?.[0]
    if (next) validateAndSet(next)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file) {
      setError('Please select a resume file.')
      return
    }

    setSubmitting(true)
    try {
      await onUpload(file, label, notes)
      resetForm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleClose} role="presentation">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Upload New Version</h2>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div
            className={`upload-dropzone${dragOver ? ' upload-dropzone--active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              hidden
              onChange={handleInputChange}
            />
            <div className="upload-icon">↑</div>
            <p className="upload-title">{file ? file.name : 'Drag & drop PDF or DOCX'}</p>
            <p className="upload-hint">or click to browse</p>
          </div>

          <div className="form-field">
            <label htmlFor="version-label">Label (optional)</label>
            <input
              id="version-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Tailored for Google SWE role"
            />
          </div>

          <div className="form-field">
            <label htmlFor="version-notes">Notes (optional)</label>
            <textarea
              id="version-notes"
              className="job-description-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What changed in this version?"
            />
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Uploading…' : 'Add version'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
