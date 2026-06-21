import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, query, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Next.js 환경에서 여러 번 초기화되는 것을 방지
const app = !getApps().length && firebaseConfig.apiKey ? initializeApp(firebaseConfig) : getApp();
const db = firebaseConfig.apiKey ? getFirestore(app) : null;

// Firebase 연동 서비스 (기존 mockDb 이름을 그대로 유지하여 코드 변경 최소화)
export const mockDb = {
  getForms: async () => {
    if (!db) return [];
    try {
      const q = query(collection(db, "forms"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error getting forms: ", e);
      // 인덱스 문제 등이 생길 수 있으니 폴백
      const querySnapshot = await getDocs(collection(db, "forms"));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },
  
  getFormById: async (id) => {
    if (!db) return null;
    try {
      const docRef = doc(db, "forms", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (e) {
      console.error("Error getting form: ", e);
      return null;
    }
  },
  
  createForm: async (form) => {
    if (!db) throw new Error("Firebase가 연결되지 않았습니다.");
    try {
      const newForm = { ...form, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, "forms"), newForm);
      return { id: docRef.id, ...newForm };
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  },
  
  submitForm: async (submission) => {
    if (!db) throw new Error("Firebase가 연결되지 않았습니다.");
    try {
      const newSub = { ...submission, submittedAt: new Date().toISOString() };
      await addDoc(collection(db, "submissions"), newSub);
      return true;
    } catch (e) {
      console.error("Error submitting form: ", e);
      throw e;
    }
  },
  
  getSubmissionsByForm: async (formId) => {
    if (!db) return [];
    try {
      const q = query(collection(db, "submissions"), where("formId", "==", formId));
      const querySnapshot = await getDocs(q);
      const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // 클라이언트 메모리에서 최신순 정렬 (Firestore 복합 인덱스 요구사항 우회)
      return subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } catch (e) {
      console.error("Error getting submissions: ", e);
      return [];
    }
  }
};
