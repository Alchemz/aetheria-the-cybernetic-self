
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, MapPin, Clock, LogOut } from 'lucide-react';
import { auth } from '@/api/supabaseClient';
import { APP_CONFIG } from '@/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Keeping this import as it was in the original, even if not explicitly used in the JSX

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    birth_time: '',
    birth_location: ''
  });

  useEffect(() => {
    checkAuthAndLoadUser();
  }, []);

  const checkAuthAndLoadUser = async () => {
    try {
      setIsLoading(true);
      
      if (APP_CONFIG.BYPASS_AUTH) {
        const demoUser = {
          full_name: 'Demo User',
          email: 'demo@example.com',
          birth_date: '',
          birth_time: '',
          birth_location: '',
          subscription_status: 'active'
        };
        setUser(demoUser);
        setFormData({
          full_name: demoUser.full_name || '',
          birth_date: demoUser.birth_date || '',
          birth_time: demoUser.birth_time || '',
          birth_location: demoUser.birth_location || ''
        });
        setIsLoading(false);
        return;
      }
      
      const authenticated = await auth.isAuthenticated();
      
      if (!authenticated) {
        auth.redirectToLogin('/account');
        return; // Stop further execution if not authenticated
      }

      const currentUser = await auth.me();
      console.log('Loaded user:', currentUser);
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || '',
        birth_date: currentUser.birth_date || '',
        birth_time: currentUser.birth_time || '',
        birth_location: currentUser.birth_location || ''
      });
    } catch (error) {
      console.error('Error loading user or authentication failed:', error);
      // If there's an error loading user (e.g., token expired or invalid), redirect to login
      auth.redirectToLogin('/account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await auth.updateMe(formData);
      alert('Profile updated successfully!');
      await checkAuthAndLoadUser(); // Reload user data after successful save
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleLogout = () => {
    auth.logout('/portal');
  };

  if (isLoading) {
    return (
      <div className="account-page">
        <style>{`
          .account-page {
            min-height: 100dvh;
            min-height: 100vh;
            background: #000;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Exo 2', sans-serif;
          }
        `}</style>
        <div style={{textAlign: 'center'}}>
          <div style={{color: '#FF5900', fontSize: '1.5rem', fontFamily: 'Orbitron'}}>
            Loading Account...
          </div>
        </div>
      </div>
    );
  }

  // If user is null after isLoading is false, it means redirectToLogin was called.
  // Display a message indicating redirection.
  if (!user) {
    return (
      <div className="account-page">
        <style>{`
          .account-page {
            min-height: 100dvh;
            min-height: 100vh;
            background: #000;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Exo 2', sans-serif;
          }
        `}</style>
        <div style={{textAlign: 'center'}}>
          <div style={{color: '#FF5900', fontSize: '1.5rem', fontFamily: 'Orbitron', marginBottom: '20px'}}>
            Redirecting to Login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .account-page {
          min-height: 100dvh;
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          padding: calc(80px + var(--safe-area-top)) 20px calc(40px + var(--safe-area-bottom));
        }

        .account-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .account-back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #FF5900;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .account-back-button:hover {
          color: #FF8C42;
          transform: translateX(-3px);
        }

        .account-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .account-title {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          color: #FF5900;
          margin-bottom: 15px;
          text-shadow: 0 0 30px #FF5900;
        }

        .account-card {
          background: rgba(255, 89, 0, 0.05);
          border: 2px solid rgba(255, 89, 0, 0.3);
          padding: 40px;
          margin-bottom: 30px;
        }

        .card-section-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          color: #FF5900;
          margin-bottom: 25px;
          letter-spacing: 0.08em;
        }

        .info-grid {
          display: grid;
          gap: 20px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 89, 0, 0.2);
        }

        .info-icon {
          color: #FF5900;
          flex-shrink: 0;
        }

        .info-content {
          flex: 1;
        }

        .info-label {
          font-size: 0.85rem;
          color: rgba(255, 179, 122, 0.7);
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .info-value {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255, 179, 122, 0.8);
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .form-input {
          background: rgba(0, 0, 0, 0.7) !important;
          border: 2px solid rgba(255, 89, 0, 0.5) !important;
          color: #FF8C42 !important;
          padding: 12px !important;
          font-size: 1rem !important;
          width: 100%;
          border-radius: 4px;
        }

        .form-input:focus {
          border-color: #FF5900 !important;
          outline: none !important;
          box-shadow: 0 0 15px rgba(255, 89, 0, 0.3) !important;
        }

        .button-group {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .subscription-banner {
          background: linear-gradient(135deg, rgba(255, 89, 0, 0.1), rgba(255, 140, 66, 0.1));
          border: 2px solid #FF5900;
          padding: 25px;
          text-align: center;
          margin-bottom: 30px;
        }

        .subscription-status {
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          color: #FF8C42;
          margin-bottom: 10px;
        }

        .subscription-dates {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .logout-button {
          background: transparent;
          border: 2px solid rgba(255, 89, 0, 0.5);
          color: #FF5900;
          padding: 12px 24px;
          font-family: 'Orbitron', monospace;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
        }

        .logout-button:hover {
          border-color: #FF5900;
          background: rgba(255, 89, 0, 0.1);
          box-shadow: 0 0 15px rgba(255, 89, 0, 0.3);
        }

        @media (max-width: 768px) {
          .account-page {
            padding: calc(60px + var(--safe-area-top)) 15px calc(30px + var(--safe-area-bottom));
          }

          .account-title {
            font-size: 2rem;
          }

          .account-card {
            padding: 25px 20px;
          }

          .card-section-title {
            font-size: 1.1rem;
          }

          .info-item {
            padding: 12px;
          }

          .button-group {
            flex-direction: column;
          }

          .button-group button {
            width: 100%;
          }
        }
      `}</style>

      <div className="account-container">
        <Link to="/portal" className="account-back-button">
          <ArrowLeft size={18} />
          Back to Portal
        </Link>

        <div className="account-header">
          <h1 className="account-title">ACCOUNT</h1>
        </div>

        {user.subscription_status && user.subscription_status !== 'none' && (
          <div className="subscription-banner">
            <div className="subscription-status">
              {user.subscription_status === 'trial' ? 'TRIAL ACTIVE' : 'SUBSCRIPTION ACTIVE'}
            </div>
            {user.subscription_end_date && (
              <div className="subscription-dates">
                Valid until: {new Date(user.subscription_end_date).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        <div className="account-card">
          <h2 className="card-section-title">PERSONAL INFORMATION</h2>

          {!isEditing ? (
            <>
              <div className="info-grid">
                <div className="info-item">
                  <User className="info-icon" size={24} />
                  <div className="info-content">
                    <div className="info-label">Name</div>
                    <div className="info-value">{user.full_name || 'Not set'}</div>
                  </div>
                </div>

                <div className="info-item">
                  <Mail className="info-icon" size={24} />
                  <div className="info-content">
                    <div className="info-label">Email</div>
                    <div className="info-value">{user.email}</div>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar className="info-icon" size={24} />
                  <div className="info-content">
                    <div className="info-label">Birth Date</div>
                    <div className="info-value">{user.birth_date || 'Not set'}</div>
                  </div>
                </div>

                <div className="info-item">
                  <Clock className="info-icon" size={24} />
                  <div className="info-content">
                    <div className="info-label">Birth Time</div>
                    <div className="info-value">{user.birth_time || 'Not set'}</div>
                  </div>
                </div>

                <div className="info-item">
                  <MapPin className="info-icon" size={24} />
                  <div className="info-content">
                    <div className="info-label">Birth Location</div>
                    <div className="info-value">{user.birth_location || 'Not set'}</div>
                  </div>
                </div>
              </div>

              <div className="button-group">
                <Button onClick={() => setIsEditing(true)} style={{ flex: 1 }}>
                  Edit Profile
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Birth Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Birth Time (HH:MM)</label>
                <input
                  className="form-input"
                  type="time"
                  value={formData.birth_time}
                  onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Birth Location</label>
                <input
                  className="form-input"
                  placeholder="City, Country"
                  value={formData.birth_location}
                  onChange={(e) => setFormData({ ...formData, birth_location: e.target.value })}
                />
              </div>

              <div className="button-group">
                <Button onClick={() => setIsEditing(false)} variant="outline" style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button onClick={handleSave} style={{ flex: 1 }}>
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </div>

        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
