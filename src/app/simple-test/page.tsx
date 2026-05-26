"use client";

export default function SimpleTest() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0B0B0F',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        One Click Advertisement
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Simple test page - if you can see this, the server is working!
      </p>
      <div style={{ 
        padding: '1rem 2rem', 
        background: '#7C3AED', 
        borderRadius: '8px',
        color: 'white'
      }}>
        ✅ Pages are loading correctly
      </div>
    </div>
  );
}
