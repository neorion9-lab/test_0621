// 실제 연동 시 아래 주석을 풀고 키를 넣으면 됩니다.
import { initializeApp } from 'firebase/app';

/*
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
export const app = initializeApp(firebaseConfig);
*/

// --- Mock Data Service (실제 Firebase 연동 전까지 사용) ---
let mockForms = [
  { id: '1', title: '봄소풍 현장체험학습 신청서', description: '5월 10일 서울대공원 봄소풍 안내 및 동의서입니다.', createdAt: '2026-05-01T10:00:00Z', status: 'active', requireSignature: true, fields: [{ id: '11', type: 'text', label: '특이사항' }] },
  { id: '2', title: '개인정보 수집 및 이용 동의서', description: '새학기 개인정보 수집 동의서입니다.', createdAt: '2026-03-02T09:00:00Z', status: 'closed', requireSignature: true, fields: [] }
];

let mockSubmissions = [];

export const mockDb = {
  getForms: async () => [...mockForms],
  getFormById: async (id) => mockForms.find(f => f.id === id),
  createForm: async (form) => {
    const newForm = { ...form, id: Date.now().toString(), createdAt: new Date().toISOString() };
    mockForms.push(newForm);
    return newForm;
  },
  submitForm: async (submission) => {
    mockSubmissions.push({ ...submission, id: Date.now().toString(), submittedAt: new Date().toISOString() });
    return true;
  },
  getSubmissionsByForm: async (formId) => mockSubmissions.filter(s => s.formId === formId)
};
