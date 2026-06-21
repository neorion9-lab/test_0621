'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockDb } from '@/lib/firebaseClient';

export default function ParentForm({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const sigCanvas = useRef({});
  const [form, setForm] = useState(null);
  const [studentNumber, setStudentNumber] = useState('');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadForm() {
      let data = await mockDb.getFormById(resolvedParams.id);
      
      // 데모를 위해 1번 폼이 없으면 기본 폼 로드
      if (!data && resolvedParams.id === '1') {
         data = (await mockDb.getForms())[0];
      }

      setForm(data);
      setLoading(false);
      
      if (data) {
        const draft = localStorage.getItem(`draft_${data.id}`);
        if (draft) {
          try {
            const parsed = JSON.parse(draft);
            setStudentNumber(parsed.studentNumber || '');
            setAnswers(parsed.answers || {});
          } catch(e) {}
        }
      }
    }
    loadForm();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (form && !submitted) {
      localStorage.setItem(`draft_${form.id}`, JSON.stringify({ studentNumber, answers }));
    }
  }, [studentNumber, answers, form, submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentNumber) return alert('학생 번호를 선택해주세요.');
    
    let signatureData = null;
    if (form.requireSignature) {
      if (sigCanvas.current.isEmpty()) {
        return alert('서명을 완료해주세요.');
      }
      signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    }

    setSubmitting(true);
    await mockDb.submitForm({
      formId: form.id,
      studentName: `${studentNumber}번`, // DB 호환을 위해 번호로 저장
      answers,
      signature: signatureData
    });

    localStorage.removeItem(`draft_${form.id}`);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }} className="animate-pulse">가정통신문을 불러오는 중...</div>;
  if (!form) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--danger)' }}>가정통신문을 찾을 수 없어요! 선생님께 다시 확인해주세요.</div>;

  if (submitted) {
    return (
      <div className="animate-fade-in glass text-center" style={{ maxWidth: '500px', margin: '4rem auto', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>🎉</div>
        <h1 style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '1rem', fontWeight: '700' }}>제출 완료!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>성공적으로 선생님께 전달되었습니다.</p>
        <Button onClick={() => router.push('/')} size="lg">처음으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', borderTop: '4px solid var(--primary)' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: '700' }}>{form.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{form.description}</p>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>👤</span> 학생 정보
        </h2>
        <div className="flex flex-col mb-4 w-full">
          <label className="label">학생 번호</label>
          <select 
            className="input-field" 
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
          >
            <option value="">번호를 선택하세요 (이름은 수집하지 않습니다)</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}번</option>
            ))}
          </select>
        </div>
      </div>

      {form.fields && form.fields.length > 0 && (
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📝</span> 설문 응답
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {form.fields.map(field => (
              <div key={field.id} style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <label className="label" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{field.label}</label>
                {field.type === 'text' && (
                  <Input 
                    placeholder="답변을 입력하세요"
                    value={answers[field.id] || ''}
                    onChange={(e) => setAnswers({...answers, [field.id]: e.target.value})}
                    style={{ marginBottom: 0 }}
                  />
                )}
                {field.type === 'date' && (
                  <Input 
                    type="date"
                    value={answers[field.id] || ''}
                    onChange={(e) => setAnswers({...answers, [field.id]: e.target.value})}
                    style={{ marginBottom: 0 }}
                  />
                )}
                {field.type === 'checkbox' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', padding: '0.5rem', background: 'var(--background)', borderRadius: '6px' }}>
                    <input 
                      type="checkbox"
                      checked={!!answers[field.id]}
                      onChange={(e) => setAnswers({...answers, [field.id]: e.target.checked})}
                      style={{ width: '1.4rem', height: '1.4rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500', cursor: 'pointer' }} onClick={() => setAnswers({...answers, [field.id]: !answers[field.id]})}>확인했습니다 (동의)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {form.requireSignature && (
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✍️</span> 학부모 서명
            </h2>
            <Button size="sm" variant="secondary" onClick={() => sigCanvas.current.clear()}>지우기</Button>
          </div>
          <div style={{ border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff', overflow: 'hidden' }}>
            <SignatureCanvas 
              ref={sigCanvas} 
              penColor="var(--primary)"
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} 
            />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
            위 네모 칸 안에 정자로 서명해주세요.
          </p>
        </div>
      )}

      <Button size="lg" style={{ width: '100%' }} onClick={handleSubmit} disabled={submitting}>
        {submitting ? '제출하는 중...' : '제출하기 🚀'}
      </Button>
    </div>
  );
}
