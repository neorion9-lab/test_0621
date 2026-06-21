'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { mockDb } from '@/lib/firebaseClient';

export default function FormResults({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      let formData = await mockDb.getFormById(resolvedParams.id);
      if (!formData) formData = (await mockDb.getForms())[0];
      
      if (formData) {
        const subsData = await mockDb.getSubmissionsByForm(formData.id);
        setForm(formData);
        setSubmissions(subsData);
      }
      setLoading(false);
    }
    loadData();
  }, [resolvedParams.id]);

  const exportCSV = () => {
    if (!form || submissions.length === 0) return alert('추출할 데이터가 없습니다.');
    
    const headers = ['제출일', '학생번호'];
    form.fields.forEach(f => headers.push(f.label));
    headers.push('서명유무');

    const rows = submissions.map(sub => {
      const row = [
        new Date(sub.submittedAt).toLocaleString(),
        sub.studentName
      ];
      form.fields.forEach(f => {
        const val = sub.answers[f.id];
        row.push(val === true ? 'O' : val === false ? 'X' : (val || ''));
      });
      row.push(sub.signature ? 'O' : 'X');
      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(["\ufeff"+csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title}_제출결과.csv`;
    link.click();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }} className="animate-pulse">데이터를 불러오는 중...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>{form?.title} 결과 분석 📊</h1>
          <p style={{ color: 'var(--text-secondary)' }}>총 {submissions.length}명이 제출했습니다.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => router.push('/teacher/dashboard')}>뒤로가기</Button>
          <Button onClick={exportCSV}>엑셀/CSV 다운로드 📥</Button>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead style={{ background: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>제출일</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>학생 번호</th>
                {form?.fields.map(f => (
                  <th key={f.id} style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{f.label}</th>
                ))}
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'center' }}>서명 확인</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={100} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    아직 제출된 응답이 없습니다. 학부모님들의 응답을 기다려주세요!
                  </td>
                </tr>
              ) : (
                submissions.map((sub, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{sub.studentName}</td>
                    {form?.fields.map(f => (
                      <td key={f.id} style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                        {sub.answers[f.id] === true ? '✅ 확인' : sub.answers[f.id] === false ? '❌ 미동의' : sub.answers[f.id]}
                      </td>
                    ))}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {sub.signature ? (
                        <div style={{ display: 'inline-block', border: '1px solid var(--border)', borderRadius: '4px', background: '#fff', padding: '2px' }}>
                          <img src={sub.signature} alt="서명" style={{ height: '30px' }} />
                        </div>
                      ) : (
                        <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>미서명</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
