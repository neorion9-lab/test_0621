'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockDb } from '@/lib/firebaseClient';

export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [requireSignature, setRequireSignature] = useState(true);

  const addField = (type) => {
    setFields([...fields, { id: Date.now().toString(), type, label: '', required: false }]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('제목을 입력해주세요.');

    const newForm = {
      title,
      description,
      fields,
      requireSignature,
      status: 'active'
    };

    await mockDb.createForm(newForm);
    router.push('/teacher/dashboard');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '2rem', fontWeight: '700' }}>새 가정통신문 만들기 📝</h1>
      
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>기본 정보</h2>
        <Input 
          label="제목" 
          placeholder="예: 봄소풍 현장체험학습 신청서" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <div className="flex flex-col w-full">
          <label className="label">설명 및 안내사항</label>
          <textarea 
            className="input-field" 
            rows={4} 
            placeholder="학부모님들께 전달할 내용을 상세히 적어주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>입력 항목 설정</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button size="sm" variant="secondary" onClick={() => addField('text')}>+ 텍스트 입력</Button>
            <Button size="sm" variant="secondary" onClick={() => addField('date')}>+ 날짜 선택</Button>
            <Button size="sm" variant="secondary" onClick={() => addField('checkbox')}>+ 체크박스</Button>
          </div>
        </div>

        {fields.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>추가된 항목이 없습니다. 상단 버튼을 눌러 학부모님이 응답할 항목을 추가하세요.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {fields.map((field, index) => (
              <div key={field.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <input 
                    className="input-field"
                    placeholder="질문 내용을 입력하세요 (예: 학생 알레르기 여부)" 
                    value={field.label}
                    onChange={(e) => updateField(field.id, 'label', e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <div style={{ minWidth: '100px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--surface-hover)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: '500' }}>
                    {field.type === 'text' ? '텍스트' : field.type === 'date' ? '날짜' : '체크박스'}
                  </span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeField(field.id)} style={{ color: 'var(--danger)' }}>삭제</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input 
            type="checkbox" 
            id="req-sig" 
            checked={requireSignature}
            onChange={(e) => setRequireSignature(e.target.checked)}
            style={{ width: '1.5rem', height: '1.5rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <label htmlFor="req-sig" style={{ fontSize: '1.1rem', fontWeight: '500', cursor: 'pointer' }}>
            학부모 전자 서명 필수 (권장)
          </label>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem', paddingLeft: '2.5rem' }}>
          제출 시 스마트폰 화면에 학부모의 직접 서명을 받습니다.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '3rem' }}>
        <Button variant="ghost" size="lg" onClick={() => router.back()}>취소</Button>
        <Button size="lg" onClick={handleSubmit}>가정통신문 배포하기 🚀</Button>
      </div>
    </div>
  );
}
