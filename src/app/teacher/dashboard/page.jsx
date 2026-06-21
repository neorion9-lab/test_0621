'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { mockDb } from '@/lib/firebaseClient';

export default function TeacherDashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadForms() {
      const data = await mockDb.getForms();
      // 최신순 정렬
      setForms(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    }
    loadForms();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>선생님 대시보드 👩‍🏫</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>가정통신문을 만들고 제출 현황을 확인하세요.</p>
        </div>
        <Link href="/teacher/form/create">
          <Button>+ 새 가정통신문 만들기</Button>
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>가정통신문 목록을 불러오는 중...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {forms.map(form => (
            <div key={form.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: form.status === 'active' ? 'var(--success)' : 'var(--border)',
                  color: form.status === 'active' ? '#000' : 'var(--text-secondary)'
                }}>
                  {form.status === 'active' ? '진행 중' : '마감됨'}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>{form.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                {form.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href={`/teacher/form/${form.id}/results`} style={{ width: '100%' }}>
                  <Button variant="secondary" style={{ width: '100%' }} size="sm">결과 분석 및 엑셀 추출</Button>
                </Link>
              </div>
            </div>
          ))}
          {forms.length === 0 && (
            <div className="glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1.1rem' }}>아직 생성된 가정통신문이 없어요!</p>
              <Link href="/teacher/form/create">
                <Button>첫 가정통신문 만들기</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
