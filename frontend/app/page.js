"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Loading application...</p></div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Redirecting...</p></div>
      </main>
    </div>
  );
}