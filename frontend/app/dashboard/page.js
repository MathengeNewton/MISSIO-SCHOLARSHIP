"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function DashboardPage() {
  const { user, logout, initialLoading } = useAuth(); // Removed actionLoading as it's not used here
  const router = useRouter();

  const [application, setApplication] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  const fetchUserApplication = useCallback(async () => {
    if (!user || !backendUrl) {
      setAppLoading(false);
      return;
    }
    setAppLoading(true);
    setAppError(null);
    try {
      const response = await axios.get(`${backendUrl}/scholarship/application`, {
        withCredentials: true,
      });
      setApplication(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setApplication(null);
      } else {
        setAppError(err.response?.data?.message || 'Failed to fetch application status.');
        console.error("Error fetching application:", err);
      }
    } finally {
      setAppLoading(false);
    }
  }, [user, backendUrl]);

  useEffect(() => {
    if (!initialLoading && !user) {
      router.replace('/login');
    } else if (user) {
      fetchUserApplication();
    }
  }, [user, initialLoading, router, fetchUserApplication]); // Added fetchUserApplication to dependency array

  if (initialLoading) { // Simplified loading check
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Loading dashboard...</p></div>;
  }

  if (!user) {
    // This case should ideally be handled by the redirect in useEffect, 
    // but as a fallback or during transition:
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Redirecting to login...</p></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', background: '#f4f7f6' }}>
      <div style={{ padding: '40px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', backgroundColor: 'white', textAlign: 'center', width: '100%', maxWidth: '600px' }}>
        <h1 style={{ marginBottom: '20px', color: '#2c3e50' }}>Dashboard</h1>
        {user && <p style={{ fontSize: '1.1em', color: '#555', marginBottom: '30px' }}>Welcome, {user.email}!</p>}

        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '30px', marginTop: '20px' }}>
          <h2 style={{ marginBottom: '20px', color: '#34495e', fontSize: '1.3em' }}>Scholarship Application Status</h2>
          {appLoading && <p style={{color: '#555'}}>Loading application status...</p>}
          {appError && <p style={{ color: 'red', marginBottom: '20px' }}>Error: {appError}</p>}
          
          {!appLoading && !appError && (
            application ? (
              <div>
                <p style={{ fontSize: '1.1em', color: '#16a085', marginBottom: '10px' }}>
                  Your application status: <strong style={{textTransform: 'capitalize'}}>{application.status}</strong>
                </p>
                <p style={{fontSize: '0.9em', color: '#7f8c8d'}}>Submitted on: {new Date(application.submittedAt).toLocaleDateString()}</p>
                 <Link href="/scholarship-application" passHref>
                   <button style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                  >
                    View/Update Application
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '1.1em', color: '#e67e22', marginBottom: '20px' }}>You have not submitted a scholarship application yet.</p>
                <Link href="/scholarship-application" passHref>
                  <button style={{
                    display: 'inline-block',
                    padding: '12px 25px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    textDecoration: 'none',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}
                  >
                    Apply for Scholarship Now
                  </button>
                </Link>
              </div>
            )
          )}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px', width: '100%' }}>
          <Link href="/" passHref>
            <button style={{
              padding: '12px 25px',
              backgroundColor: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#555'}
            >
              Go to Home
            </button>
          </Link>
          <button
            onClick={logout}
            style={{
              padding: '12px 24px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            Logout
          </button>
        </div>
      </div> {/* This closes the inner content card div */}
    </div> /* This closes the main outer div */
  );
}
