import { ThoughtWorksheet, WorksheetField } from './ThoughtWorksheet';
import { FileText, Music, Video, Lightbulb, PenTool } from 'lucide-react';

export interface APIExercise {
  id: string;
  pathwaySlug: string;
  stepIndex: number;
  type: string;
  title: string;
  fields: WorksheetField[] | null;
  mediaType: string | null;
  mediaUrl: string | null;
  content: string | null;
}

const C = {
  bg: '#faf7f2', text: '#3d3b37', muted: '#8c8577', border: '#e8e2d6',
  accent: '#5c7c66', accentLight: '#eef2ef', highlight: '#c97b63',
};

export function ExerciseRenderer({ exercise }: { exercise: APIExercise }) {
  const isWorksheet = exercise.type === 'worksheet' || (exercise.fields && exercise.fields.length > 0);

  if (isWorksheet) {
    return (
      <div style={{ marginTop: '10px' }}>
        <ThoughtWorksheet exerciseId={exercise.id} title={exercise.title} fields={exercise.fields || undefined} />
      </div>
    );
  }

  // تمرين نصي (نص + صوت + فيديو)
  const renderMedia = () => {
    if (!exercise.mediaUrl) return null;

    if (exercise.mediaType === 'audio') {
      return (
        <div style={{ marginTop: '16px', padding: '12px', background: C.bg, borderRadius: '12px', border: `1px solid ${C.border}` }}>
          <audio controls style={{ width: '100%' }} src={exercise.mediaUrl} />
        </div>
      );
    }

    if (exercise.mediaType === 'video') {
      return (
        <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
          <video controls style={{ width: '100%', display: 'block' }} src={exercise.mediaUrl} />
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ background: C.bg, borderRadius: '16px', padding: '20px', border: `1px solid ${C.border}`, marginTop: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: C.accentLight, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {exercise.mediaType === 'audio' ? <Music size={18} /> : exercise.mediaType === 'video' ? <Video size={18} /> : <FileText size={18} />}
        </div>
        <span style={{ fontSize: '0.85em', fontWeight: 'bold', color: C.accent, letterSpacing: '0.5px' }}>تمرين تطبيقي</span>
      </div>

      {exercise.content && (
        <p style={{ color: C.text, lineHeight: 1.8, fontSize: '1em', margin: 0, whiteSpace: 'pre-wrap' }}>
          {exercise.content}
        </p>
      )}

      {renderMedia()}
    </div>
  );
}
