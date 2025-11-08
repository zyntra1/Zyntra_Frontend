import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, CheckCircle2, AlertCircle, Loader2, User, Shield, Download, Trash2, RefreshCw } from 'lucide-react';

const GaitRecognition = ({ userRole = 'user' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const stopPollingRef = useRef(false);

  useEffect(() => {
    // Check if user is admin from localStorage
    const userType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
    const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    
    if (userType === 'admin') {
      setIsAdmin(true);
    } else if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.email?.toLowerCase().includes('admin')) {
        setIsAdmin(true);
      } else {
        // For regular users, fetch their profile status on load
        fetchUserProfile();
      }
    }
  }, []);

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!authToken) {
        console.log('No auth token found');
        return;
      }

      // First check profile status
      const statusResponse = await fetch('https://aaa95094eca4.ngrok-free.app/gait/profile-status', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setProfileStatus(statusData);
        console.log('Profile status:', statusData);

        // If profile exists, fetch full profile details
        if (statusData.status !== 'not_found') {
          const profileResponse = await fetch('https://aaa95094eca4.ngrok-free.app/gait/user-profile', {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'accept': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            }
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setUserProfile(profileData);
            console.log('User profile:', profileData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const deleteUserProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your gait profile? This action cannot be undone.')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      const response = await fetch('https://aaa95094eca4.ngrok-free.app/gait/user-profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile deleted:', data);
        setUserProfile(null);
        setProfileStatus({ status: 'not_found', message: 'No gait profile found' });
        setUploadStatus({ type: 'success', message: data.message || 'Profile deleted successfully' });
      } else {
        throw new Error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setUploadStatus({ type: 'error', message: 'Failed to delete profile' });
    }
  };

  const pollProfileStatus = async (authToken) => {
    let attempts = 0;
    const maxAttempts = 60; // Poll for up to 2 minutes (every 2 seconds)
    
    console.log('🔄 Starting to poll profile status...');
    
    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        console.log('⏱️ Polling timeout reached');
        setUploadStatus({ 
          type: 'success', 
          message: 'Processing is taking longer than expected. Please refresh manually.' 
        });
        return;
      }
      
      attempts++;
      console.log(`📊 Checking profile status (attempt ${attempts}/${maxAttempts})...`);
      
      try {
        const statusResponse = await fetch('https://aaa95094eca4.ngrok-free.app/gait/profile-status', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('Profile status:', statusData.status);
          
          if (statusData.status === 'completed') {
            console.log('✅ Profile processing completed!');
            setUploadStatus({ 
              type: 'success', 
              message: '✅ Profile completed! Your gait profile is ready.' 
            });
            
            // Refresh the profile to show updated information
            await fetchUserProfile();
            
            // Clear the processing message after a few seconds
            setTimeout(() => {
              setAnalysisResult(null);
            }, 1000);
            
            return; // Stop polling
          } else if (statusData.status === 'processing') {
            console.log('⏳ Still processing...');
            setUploadStatus({ 
              type: 'success', 
              message: `Processing your video... (${attempts * 2}s elapsed)` 
            });
            
            // Continue polling
            setTimeout(checkStatus, 2000);
          } else if (statusData.status === 'failed' || statusData.status === 'error') {
            console.error('❌ Processing failed');
            setUploadStatus({ 
              type: 'error', 
              message: 'Profile processing failed. Please try again.' 
            });
            setAnalysisResult(null);
            return;
          } else {
            // Unknown status, continue polling
            setTimeout(checkStatus, 2000);
          }
        } else {
          console.error('Failed to fetch profile status');
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Error polling profile status:', error);
        setTimeout(checkStatus, 2000);
      }
    };
    
    // Start polling after initial delay
    setTimeout(checkStatus, 2000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setUploadStatus(null);
      } else {
        setUploadStatus({ type: 'error', message: 'Please upload a video file' });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setUploadStatus(null);
        console.log('Video file accepted');
      } else {
        console.warn('Invalid file type:', file.type);
        setUploadStatus({ type: 'error', message: 'Please upload a video file' });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus(null);
    stopPollingRef.current = false;

    try {
      // Get auth token
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      console.log('Auth token:', authToken ? 'Found' : 'Not found');
      
      if (!authToken) {
        setUploadStatus({ type: 'error', message: 'Please log in to upload videos' });
        setUploading(false);
        return;
      }

      // Upload video - use different endpoint based on user role
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadEndpoint = isAdmin 
        ? 'https://aaa95094eca4.ngrok-free.app/gait/upload-cctv-video'
        : 'https://aaa95094eca4.ngrok-free.app/gait/upload-user-video';

      console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size);
      console.log('User role:', isAdmin ? 'Admin' : 'User', 'Endpoint:', uploadEndpoint);

      const uploadResponse = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      console.log('Upload response status:', uploadResponse.status);
      console.log('Response content-type:', uploadResponse.headers.get('content-type'));

      // Check if response is JSON
      const contentType = uploadResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await uploadResponse.text();
        console.error('Non-JSON response:', textResponse.substring(0, 200));
        throw new Error('Server returned non-JSON response. The API endpoint might be incorrect or the ngrok URL may have expired.');
      }

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error('Upload error:', errorData);
        throw new Error(errorData.detail || `Upload failed with status ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload success - Full response:', uploadData);
      
      // For user uploads, log_id might be null initially (background processing)
      const logId = uploadData.log_id;
      const profileId = uploadData.profile_id;

      console.log('Extracted log_id:', logId);
      console.log('Extracted profile_id:', profileId);
      console.log('Upload message:', uploadData.message);
      console.log('Status:', uploadData.status);

      // For regular users, if log_id is null, it's processing in background
      if (!logId && !isAdmin) {
        setUploadStatus({ 
          type: 'success', 
          message: uploadData.message || 'Video uploaded successfully. Processing in background.' 
        });
        setAnalysisResult({
          confidence: 0,
          gaitPattern: 'Processing in Background',
          metrics: {
            'Status': 'Processing',
            'Message': 'Your video is being processed. Check back later.'
          },
          processedVideoUrl: null
        });
        
        // Start polling for profile status completion
        pollProfileStatus(authToken);
        
        setUploading(false);
        return; // Exit early for background processing
      }

      if (!logId && isAdmin) {
        console.error('Available keys in response:', Object.keys(uploadData));
        throw new Error('No log_id returned from upload. Check console for response data.');
      }

      console.log('Using log_id:', logId);
      setUploadStatus({ type: 'success', message: `${uploadData.message} (Log ID: ${logId})` });

      // Poll for recognition status
      let processingComplete = false;
      let attempts = 0;
      const maxAttempts = 150; // 5 minutes max (checking every 2 seconds)

      while (!processingComplete && attempts < maxAttempts && !stopPollingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        // Check if stop was requested during the wait
        if (stopPollingRef.current) {
          console.log('Polling stopped by user');
          setUploadStatus({ type: 'error', message: 'Processing stopped by user' });
          break;
        }
        
        attempts++;

        console.log(`Checking status (attempt ${attempts}/${maxAttempts}) for log_id: ${logId}...`);
        setUploadStatus({ type: 'success', message: `Processing video... (${attempts * 2}s elapsed)` });

        const statusResponse = await fetch(`https://aaa95094eca4.ngrok-free.app/gait/recognition-status/${logId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }).catch(err => {
          console.error('Network error fetching status:', err);
          return null;
        });

        if (!statusResponse) {
          console.log('Retrying after network error...');
          continue;
        }

        console.log('Status response:', statusResponse.status, statusResponse.statusText);

        if (!statusResponse.ok) {
          console.error('Status check failed:', statusResponse.status, statusResponse.statusText);
          const errorText = await statusResponse.text().catch(() => 'Unable to read error');
          console.error('Error response:', errorText);
          
          if (attempts > 10) {
            throw new Error(`Status check failing repeatedly (${statusResponse.status}). Check if log_id ${logId} is valid.`);
          }
          continue;
        }

        const statusContentType = statusResponse.headers.get('content-type');
        if (!statusContentType || !statusContentType.includes('application/json')) {
          const textResponse = await statusResponse.text();
          console.error('Status check returned non-JSON response. Content-Type:', statusContentType);
          console.error('Response body (first 500 chars):', textResponse.substring(0, 500));
          
          // If we get HTML response after multiple attempts, stop
          if (attempts > 5 && textResponse.includes('<!DOCTYPE')) {
            throw new Error('API is returning HTML instead of JSON. The ngrok URL might have expired or the endpoint is incorrect.');
          }
          continue;
        }
        
        try {
          const statusData = await statusResponse.json();
          console.log('Status data:', statusData);
            
            if (statusData.status === 'completed' || statusData.status === 'processed') {
              console.log('Processing completed!');
              processingComplete = true;
              
              // Get download URL
              let downloadUrl = null;
              try {
                const downloadResponse = await fetch(`https://aaa95094eca4.ngrok-free.app/gait/download-processed-video/${logId}`, {
                  headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                  }
                });
                
                if (downloadResponse.ok) {
                  const downloadData = await downloadResponse.json();
                  console.log('Download data:', downloadData);
                  downloadUrl = downloadData.download_url;
                  console.log('Extracted download URL:', downloadUrl);
                } else {
                  console.error('Download endpoint failed:', downloadResponse.status);
                }
              } catch (error) {
                console.error('Error fetching download URL:', error);
              }
              
              if (!downloadUrl) {
                console.warn('No download URL received. Video preview will not be available.');
              }
              
              setAnalysisResult({
                logId: logId,
                confidence: 95.0,
                totalPersonsDetected: statusData.total_persons_detected || 0,
                totalRecognized: statusData.total_recognized || 0,
                createdAt: statusData.created_at,
                completedAt: statusData.completed_at,
                gaitPattern: 'Completed',
                metrics: {
                  'Persons Detected': statusData.total_persons_detected || 0,
                  'Recognized': statusData.total_recognized || 0,
                  'Processing Time': statusData.completed_at ? 
                    `${Math.round((new Date(statusData.completed_at) - new Date(statusData.created_at)) / 1000)}s` : 'N/A'
                },
                processedVideoUrl: downloadUrl
              });
              
              console.log('Analysis result set with video URL:', downloadUrl);
              setUploadStatus({ type: 'success', message: downloadUrl ? 'Video analyzed and ready to preview!' : 'Video analyzed successfully!' });
            } else if (statusData.status === 'failed' || statusData.status === 'error') {
              console.error('Processing failed:', statusData);
              throw new Error(statusData.message || 'Video processing failed');
            } else {
              console.log('Still processing... Status:', statusData.status);
            }
        } catch (parseError) {
          console.error('Error parsing status JSON:', parseError);
          // Continue polling
        }
      }

      if (!processingComplete) {
        setUploadStatus({ type: 'error', message: 'Processing timeout. Please check status later.' });
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Upload failed. Please try again. Check console for details.' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-night-blue to-forest-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            {isAdmin ? (
              <Shield className="w-10 h-10 text-sunlight-yellow" />
            ) : (
              <User className="w-10 h-10 text-forest-light" />
            )}
            <h1 className="text-4xl md:text-5xl font-black text-forest-light">
              Profile
            </h1>
          </div>
          <p className="text-lg text-forest-light/70 max-w-2xl mx-auto">
            {isAdmin 
              ? 'Admin Dashboard - Manage and analyze all gait recognition data'
              : 'Manage your gait profile for AI-powered recognition and security'
            }
          </p>
        </motion.div>

        {/* User Profile Section - Only for regular users */}
        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 rounded-3xl border border-forest-light/20 shadow-2xl mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-forest-light flex items-center gap-2">
                <User className="w-6 h-6" />
                My Gait Profile
              </h2>
              <button
                onClick={fetchUserProfile}
                disabled={loadingProfile}
                className="flex items-center gap-2 px-4 py-2 bg-forest-light/10 text-forest-light rounded-xl font-semibold hover:bg-forest-light/20 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingProfile ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loadingProfile ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <Loader2 className="w-8 h-8 text-forest-light animate-spin mx-auto mb-2" />
                  <p className="text-forest-light/60">Loading profile...</p>
                </motion.div>
              ) : userProfile ? (
                <motion.div
                  key="profile-exists"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                      <p className="text-forest-light/60 text-sm mb-1">Profile ID</p>
                      <p className="text-forest-light font-semibold">#{userProfile.id}</p>
                    </div>
                    <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                      <p className="text-forest-light/60 text-sm mb-1">Created</p>
                      <p className="text-forest-light font-semibold">
                        {new Date(userProfile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                      <p className="text-forest-light/60 text-sm mb-1">Embedding Size</p>
                      <p className="text-forest-light font-semibold">{userProfile.embedding_dimension}D</p>
                    </div>
                    <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                      <p className="text-forest-light/60 text-sm mb-1">Status</p>
                      <p className="text-green-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Active
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-forest-light/10">
                    <p className="text-forest-light/70 text-sm">
                      Your gait profile is active and ready for recognition
                    </p>
                    <button
                      onClick={deleteUserProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl font-semibold hover:bg-red-500/20 transition-all border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Profile
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="no-profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-8 bg-forest-light/5 rounded-xl border border-forest-light/10"
                >
                  <AlertCircle className="w-12 h-12 text-forest-light/50 mx-auto mb-3" />
                  <p className="text-forest-light font-semibold mb-2">No Gait Profile Found</p>
                  <p className="text-forest-light/60 text-sm">
                    Upload a video below to create your gait profile
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-8 rounded-3xl border border-forest-light/20 shadow-2xl mb-8"
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-forest-light bg-forest-light/10' 
                : 'border-forest-light/30 hover:border-forest-light/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
            
            {!selectedFile ? (
              <div className="cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <Upload className="w-20 h-20 text-forest-light mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-forest-light mb-3">
                  {isAdmin ? 'Upload CCTV Video' : userProfile ? 'Update Gait Profile' : 'Create Gait Profile'}
                </h3>
                <p className="text-forest-light/60 mb-6">
                  {isAdmin 
                    ? 'Drag and drop CCTV footage here, or click to browse'
                    : userProfile 
                      ? 'Upload a new video to update your gait profile'
                      : 'Upload your gait video to create your unique profile'
                  }
                </p>
                <button 
                  type="button"
                  className="px-8 py-3 bg-forest-light text-forest-900 rounded-xl font-bold hover:bg-forest-light/90 transition-all shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('file-upload').click();
                  }}
                >
                  Choose File
                </button>
                <p className="text-sm text-forest-light/50 mt-4">
                  Supported formats: MP4, MOV, AVI (Max size: 100MB)
                </p>
                {!isAdmin && (
                  <p className="text-sm text-forest-light/70 mt-2 font-medium">
                    {userProfile ? '⚠️ This will replace your existing profile' : '✨ First time? Let\'s create your profile!'}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 text-forest-light">
                  <Video className="w-12 h-12" />
                  <div className="text-left">
                    <p className="font-semibold text-lg">{selectedFile.name}</p>
                    <p className="text-sm text-forest-light/60">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      console.log('Upload button clicked');
                      handleUpload();
                    }}
                    disabled={uploading}
                    className="px-8 py-3 bg-forest-light text-forest-900 rounded-xl font-bold hover:bg-forest-light/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload & Analyze
                      </>
                    )}
                  </button>
                  
                  {uploading ? (
                    <button
                      onClick={() => {
                        console.log('Stop button clicked');
                        stopPollingRef.current = true;
                        setUploading(false);
                      }}
                      className="px-8 py-3 border-2 border-red-500/50 text-red-400 rounded-xl font-bold hover:bg-red-500/10 transition-all"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadStatus(null);
                        setAnalysisResult(null);
                      }}
                      className="px-8 py-3 border-2 border-forest-light/30 text-forest-light rounded-xl font-bold hover:bg-forest-light/10 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                uploadStatus.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              <p className="font-semibold">{uploadStatus.message}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GaitRecognition;
