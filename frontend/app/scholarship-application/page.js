"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming useAuth provides user and loading state
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ScholarshipApplicationPage() {
  const { user, initialLoading, actionLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    currentInstitution: '',
    programOfStudy: '',
    gpa: '',
    essay: '',
    householdIncome: '',
    incomeProofDocument: null, // For file inputs, store the File object or filename
    transcriptDocument: null,
    recommendationLetterDocument: null,
  });
  const [existingApplication, setExistingApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // For page data loading
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch existing application
  const fetchApplication = useCallback(async () => {
    if (!user || !backendUrl) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/scholarship/application`, { withCredentials: true });
      if (response.data) {
        setExistingApplication(response.data);
        // Pre-fill form if needed, or just show a message
        // For simplicity, we'll just show a message if an application exists
        // and prevent new submission via UI logic.
        // Or, you could load data into formData: setFormData({...response.data, dateOfBirth: response.data.dateOfBirth?.split('T')[0]});
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No application found, this is fine
        setExistingApplication(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch application details.');
      }
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!initialLoading && !user) {
      router.replace('/login'); // Redirect if not authenticated
    } else if (user) {
      fetchApplication();
    }
  }, [user, initialLoading, router, fetchApplication]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingApplication && existingApplication.status === 'submitted') {
        setError('You have already submitted an application.');
        return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation (can be expanded)
    if (!formData.fullName || !formData.dateOfBirth || !formData.essay) {
        setError('Full Name, Date of Birth, and Essay are required.');
        setIsSubmitting(false);
        return;
    }
    
    // NOTE: File handling for actual upload is complex and not fully implemented here.
    // This example assumes filenames or placeholders are sent.
    // For real uploads, you'd use FormData and multipart/form-data.
    const payload = {
        ...formData,
        // If you were just sending filenames:
        // incomeProofDocument: formData.incomeProofDocument?.name || null,
        // transcriptDocument: formData.transcriptDocument?.name || null,
        // recommendationLetterDocument: formData.recommendationLetterDocument?.name || null,
    };

    try {
      await axios.post(`${backendUrl}/scholarship/apply`, payload, { withCredentials: true });
      setSuccessMessage('Application submitted successfully!');
      // Optionally, refetch application or redirect
      fetchApplication(); // To update existingApplication state
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    }
    setIsSubmitting(false);
  };

  if (initialLoading || isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Loading application...</p></div>;
  }

  // Basic styling - can be significantly improved
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <Link href="/" passHref>
          <button style={{
            padding: '10px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '500',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
          >
            &larr; Go to Home
          </button>
        </Link>
      </div>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Scholarship Application</h1>
      
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green', textAlign: 'center', marginBottom: '20px', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>{successMessage}</p>}

      {existingApplication && !successMessage ? (
        <div>
          <h2 style={{color: '#16a085', textAlign: 'center'}}>Application Status: {existingApplication.status}</h2>
          <p style={{textAlign: 'center', marginBottom: '20px'}}>You have already submitted an application on {new Date(existingApplication.submittedAt).toLocaleDateString()}.</p>
          {/* Optionally, display submitted data or an update form here */}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={labelStyle} htmlFor="fullName">Full Name:</label>
          <input style={inputStyle} type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required />

          <label style={labelStyle} htmlFor="dateOfBirth">Date of Birth:</label>
          <input style={inputStyle} type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

          <label style={labelStyle} htmlFor="address">Address:</label>
          <textarea style={{...inputStyle, height: '80px'}} name="address" id="address" value={formData.address} onChange={handleChange}></textarea>

          <label style={labelStyle} htmlFor="phoneNumber">Phone Number:</label>
          <input style={inputStyle} type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

          <h2 style={{ marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#34495e' }}>Academic Details</h2>
          <label style={labelStyle} htmlFor="currentInstitution">Current Educational Institution:</label>
          <input style={inputStyle} type="text" name="currentInstitution" id="currentInstitution" value={formData.currentInstitution} onChange={handleChange} />

          <label style={labelStyle} htmlFor="programOfStudy">Program of Study (Intended or Current):</label>
          <input style={inputStyle} type="text" name="programOfStudy" id="programOfStudy" value={formData.programOfStudy} onChange={handleChange} />

          <label style={labelStyle} htmlFor="gpa">GPA (e.g., 3.5):</label>
          <input style={inputStyle} type="number" step="0.01" name="gpa" id="gpa" value={formData.gpa} onChange={handleChange} />

          <label style={labelStyle} htmlFor="essay">Personal Essay (max 500 words):</label>
          <textarea style={{...inputStyle, height: '200px'}} name="essay" id="essay" value={formData.essay} onChange={handleChange} required></textarea>

          <h2 style={{ marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#34495e' }}>Financial Information</h2>
          <label style={labelStyle} htmlFor="householdIncome">Annual Household Income (USD):</label>
          <input style={inputStyle} type="number" name="householdIncome" id="householdIncome" value={formData.householdIncome} onChange={handleChange} />

          {/* Document Upload Placeholders - Actual upload requires more setup */}
          <h2 style={{ marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#34495e' }}>Required Documents</h2>
          <p style={{fontSize: '0.9em', color: '#7f8c8d', marginBottom: '15px'}}>Note: Document uploads are currently placeholders. In a full application, you would upload files here.</p>
          
          <label style={labelStyle} htmlFor="incomeProofDocument">Proof of Income (e.g., tax return snippet):</label>
          <input style={inputStyle} type="file" name="incomeProofDocument" id="incomeProofDocument" onChange={handleChange} />

          <label style={labelStyle} htmlFor="transcriptDocument">Academic Transcript:</label>
          <input style={inputStyle} type="file" name="transcriptDocument" id="transcriptDocument" onChange={handleChange} />

          <label style={labelStyle} htmlFor="recommendationLetterDocument">Letter of Recommendation (Optional):</label>
          <input style={inputStyle} type="file" name="recommendationLetterDocument" id="recommendationLetterDocument" onChange={handleChange} />

          <button 
            type="submit" 
            disabled={isSubmitting || (existingApplication && !successMessage)}
            style={{
              display: 'block', 
              width: '100%', 
              padding: '15px', 
              backgroundColor: (isSubmitting || (existingApplication && !successMessage)) ? '#bdc3c7' : '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: (isSubmitting || (existingApplication && !successMessage)) ? 'not-allowed' : 'pointer', 
              fontSize: '18px', 
              fontWeight: 'bold',
              marginTop: '30px'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      )}
    </div>
  );
}
