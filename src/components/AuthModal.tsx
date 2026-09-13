import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogOut, 
  Loader2, 
  Database, 
  Bookmark, 
  Mail,
  CheckCircle2,
  Camera,
  Upload,
  Trash2,
  Edit3,
  ArrowLeft,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithCredential,
  GoogleAuthProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut,
  type FirebaseUser
} from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { sendPasswordResetEmail } from 'firebase/auth';
import { syncUserProfile, getUserProfile, updateUserProfileData } from '../lib/userService';
import type { AppUser } from '../types';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: unknown) => void;
          prompt: (notification?: (notification: unknown) => void) => void;
          renderButton: (parent: HTMLElement, options: unknown) => void;
          cancel: () => void;
        };
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (error: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
  currentUser: AppUser | null;
  onSignInSuccess?: (user: AppUser) => void;
  onSignIn?: (email: string, name?: string) => void;
  onSignOut?: () => void;
  onUpdateUser?: (user: AppUser) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  currentUser,
  onSignInSuccess,
  onSignIn,
  onSignOut,
  onUpdateUser,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhotoURL, setEditPhotoURL] = useState<string | null>(currentUser?.photoURL || null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhotoURL(currentUser.photoURL || null);
    }
  }, [currentUser]);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file must be under 5MB.');
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Standardize to 160x160 square canvas for sharp rendering and light storage
        const canvas = document.createElement('canvas');
        const size = 160;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setEditPhotoURL(dataUrl);
        }
        setIsUploadingPhoto(false);
      };
      img.onerror = () => {
        setErrorMessage('Could not process the selected image.');
        setIsUploadingPhoto(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Name must be at least 2 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setProfileSuccessMsg(null);

    try {
      // 1. Update Firebase Auth user profile
      // Note: Firebase Auth enforces a strict 2048-character limit on photoURL.
      // Base64 data URLs exceed this and trigger auth/invalid-profile-attribute.
      // We safely only pass standard HTTP/HTTPS URLs <= 2048 chars to Firebase Auth.
      // The full custom avatar image is saved in Cloud Firestore and local state.
      if (auth.currentUser) {
        const isStandardWebUrl = Boolean(
          editPhotoURL &&
          (editPhotoURL.startsWith('http://') || editPhotoURL.startsWith('https://')) &&
          editPhotoURL.length <= 2048
        );

        const authProfilePayload: { displayName: string; photoURL?: string | null } = {
          displayName: trimmedName,
        };

        if (isStandardWebUrl) {
          authProfilePayload.photoURL = editPhotoURL;
        } else if (!editPhotoURL) {
          authProfilePayload.photoURL = null;
        }

        try {
          await updateProfile(auth.currentUser, authProfilePayload);
        } catch (authErr) {
          console.warn('Firebase Auth updateProfile non-fatal warning:', authErr);
        }
      }

      // 2. Update Firestore user document (Firestore supports base64 avatar images)
      await updateUserProfileData(currentUser.uid, {
        displayName: trimmedName,
        photoURL: editPhotoURL || null,
      });

      // 3. Update parent state
      const updatedUser: AppUser = {
        ...currentUser,
        name: trimmedName,
        photoURL: editPhotoURL || null,
      };
      onUpdateUser?.(updatedUser);
      onSignInSuccess?.(updatedUser);

      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        setIsEditingProfile(false);
        setProfileSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      console.error('Error updating profile:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setInfoMessage(null);
      setShowHelp(false);
      if (!currentUser) {
        setEmail('');
        setPassword('');
        setDisplayName('');
      }

      // Prevent background scrolling while modal is open
      const scrollY = window.scrollY;
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.overflow = originalStyle;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, initialMode, currentUser]);

  if (!isOpen) return null;

  // Format error messages from Firebase Auth codes
  const mapFirebaseError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'auth/email-already-in-use':
          return 'An account already exists with this email address. Please switch to Sign In.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          return 'Incorrect email or password. Please verify your credentials.';
        case 'auth/user-not-found':
          return 'No WorldScope account found with this email. Please register below.';
        case 'auth/weak-password':
          return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/popup-closed-by-user':
          return 'Google sign-in popup was closed before completion. Please try again.';
        case 'auth/popup-blocked':
          return 'Browser blocked the Google sign-in window. Please enable popups for this site.';
        case 'auth/unauthorized-domain':
          return 'This domain is not yet authorized for Google Sign-In in Firebase. You can open WorldScope in a new tab or sign in with your email below.';
        case 'auth/cancelled-popup-request':
          return 'Previous sign-in request was cancelled. Please try again.';
        case 'auth/network-request-failed':
          return 'Network error connecting to authentication services. Please check your connection.';
        case 'auth/too-many-requests':
          return 'Too many attempts. Access is temporarily restricted. Please try again later.';
        default:
          if ('message' in error && typeof (error as { message: string }).message === 'string') {
            return (error as { message: string }).message;
          }
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };

  // User authentication success processor
  const handleAuthSuccess = async (user: FirebaseUser, providerId: string = 'google.com') => {
    try {
      const profile = await syncUserProfile(user);

      const appUser: AppUser = {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || profile.displayName || 'Reader',
        photoURL: user.photoURL || profile.photoURL || null,
        providerId,
        savedArticles: profile.savedArticles || [],
        subscribedNewsletters: profile.subscribedNewsletters || ['global-dispatch'],
      };

      onSignInSuccess?.(appUser);
      onSignIn?.(appUser.email, appUser.name);
      setInfoMessage('Successfully signed in with Google!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('Post-auth profile setup warning:', err);
      const appUser: AppUser = {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || 'Reader',
        photoURL: user.photoURL || null,
        providerId,
        savedArticles: [],
        subscribedNewsletters: ['global-dispatch'],
      };
      onSignInSuccess?.(appUser);
      onSignIn?.(appUser.email, appUser.name);
      setInfoMessage('Signed in!');
      setTimeout(() => {
        onClose();
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to standard Firebase signInWithPopup with timeout protection
  const fallbackFirebasePopup = async () => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('POPUP_TIMEOUT'));
        }, 12000);
      });

      const popupPromise = signInWithPopup(auth, googleProvider);
      const result = await Promise.race([popupPromise, timeoutPromise]);
      await handleAuthSuccess(result.user, 'google.com');
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);

      // Check if user authenticated in the background
      if (auth.currentUser) {
        await handleAuthSuccess(auth.currentUser, 'google.com');
        return;
      }

      if (err instanceof Error && err.message === 'POPUP_TIMEOUT') {
        setErrorMessage(
          'Google sign-in window timed out or was blocked by the browser. If you are in a preview iframe, please open in a new tab or sign in below with email & password.'
        );
      } else {
        setErrorMessage(mapFirebaseError(err));
      }
      setIsLoading(false);
    }
  };

  // Google Sign-In with GIS Token Client & Firebase Auth
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    const clientId = firebaseConfig.oAuthClientId;

    // Strategy 1: Use Google Identity Services OAuth2 Token Client if available in window
    if (clientId && typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              console.warn('GIS token error:', tokenResponse.error);
              if (tokenResponse.error === 'popup_closed_by_user' || tokenResponse.error === 'access_denied') {
                setIsLoading(false);
                return;
              }
              await fallbackFirebasePopup();
              return;
            }

            if (tokenResponse.access_token) {
              try {
                const credential = GoogleAuthProvider.credential(null, tokenResponse.access_token);
                const result = await signInWithCredential(auth, credential);
                await handleAuthSuccess(result.user, 'google.com');
              } catch (credErr) {
                console.error('Credential sign-in failed, trying popup fallback:', credErr);
                await fallbackFirebasePopup();
              }
            }
          },
          error_callback: (err) => {
            console.warn('GIS error callback:', err);
            fallbackFirebasePopup();
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (gisErr) {
        console.warn('GIS error, falling back to Firebase popup:', gisErr);
      }
    }

    // Strategy 2: Firebase Popup with timeout protection
    await fallbackFirebasePopup();
  };

  // Email/Password Submit (Sign In or Register)
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      if (mode === 'register') {
        // Register new account with Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const resolvedName = displayName.trim() || email.split('@')[0];

        if (displayName.trim()) {
          try {
            await updateProfile(cred.user, { displayName: resolvedName });
          } catch (profileErr) {
            console.warn('Could not update Auth displayName:', profileErr);
          }
        }

        // Persist user record in Cloud Firestore
        const profile = await syncUserProfile(cred.user, resolvedName);

        const appUser: AppUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          name: resolvedName,
          photoURL: cred.user.photoURL || null,
          providerId: 'password',
          savedArticles: profile.savedArticles || [],
          subscribedNewsletters: profile.subscribedNewsletters || ['global-dispatch'],
        };

        onSignInSuccess?.(appUser);
        onSignIn?.(appUser.email, appUser.name);
        setInfoMessage('Your WorldScope account was created successfully!');
      } else {
        // Sign into existing account with Firebase Auth
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

        // Fetch persisted profile from Cloud Firestore
        let profile = await getUserProfile(cred.user.uid);
        if (!profile) {
          profile = await syncUserProfile(cred.user);
        }

        const appUser: AppUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          name: profile.displayName || cred.user.displayName || email.split('@')[0],
          photoURL: cred.user.photoURL || profile.photoURL || null,
          providerId: 'password',
          savedArticles: profile.savedArticles || [],
          subscribedNewsletters: profile.subscribedNewsletters || ['global-dispatch'],
        };

        onSignInSuccess?.(appUser);
        onSignIn?.(appUser.email, appUser.name);
        setInfoMessage('Signed in successfully.');
      }
    } catch (err) {
      console.error('Email authentication error:', err);
      setErrorMessage(mapFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const handlePasswordReset = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter your email above before requesting a password reset.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfoMessage(`Password reset email has been dispatched to ${email}. Check your inbox.`);
    } catch (err) {
      console.error('Password reset error:', err);
      setErrorMessage(mapFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const handleSignOutAction = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      onSignOut?.();
      setInfoMessage('You have been signed out.');
      setMode('signin');
    } catch (err) {
      console.error('Sign out error:', err);
      onSignOut?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-6 sm:p-10 overflow-y-auto animate-in fade-in duration-200"
      id="worldscope-auth-modal"
    >
      {/* Top Bar with White Square Close Button in Top-Right */}
      <div className="w-full flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-white text-black w-8 h-8 flex items-center justify-center font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
          aria-label="Close"
          title="Close authentication modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Center Form Area */}
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center text-center">
        {/* WorldScope Daily Logo in Dark Theme */}
        <div className="flex items-center justify-center mb-6">
          <Logo variant="header" theme="dark" />
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: SIGNED IN PROFILE VIEW OR EDIT PROFILE */}
        {/* ========================================================================= */}
        {currentUser ? (
          isEditingProfile ? (
            <div className="w-full max-w-sm text-left animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setErrorMessage(null);
                    setProfileSuccessMsg(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Account</span>
                </button>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Profile Settings
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                Edit Profile
              </h2>
              <p className="text-xs text-neutral-400 mb-5">
                Update your public WorldScope reader display name and profile picture.
              </p>

              {/* Feedback messages */}
              {profileSuccessMsg && (
                <div className="p-3 mb-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 mb-4 bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
                  <span className="font-bold shrink-0">!</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* 1. Profile Picture Section */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Profile Picture
                  </label>
                  
                  <div className="flex items-center gap-4 p-3 bg-neutral-900 border border-neutral-800 rounded-xs">
                    {/* Avatar Preview */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-700 hover:border-white transition-colors cursor-pointer group shrink-0 bg-neutral-800 flex items-center justify-center"
                      title="Click to change photo"
                    >
                      {editPhotoURL ? (
                        <img 
                          src={editPhotoURL} 
                          alt={editName} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#006def] text-white flex items-center justify-center font-bold text-xl">
                          {(editName || currentUser.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                        <Camera className="w-4 h-4" />
                        <span className="text-[9px] font-bold mt-0.5">Upload</span>
                      </div>

                      {isUploadingPhoto && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            processImageFile(e.target.files[0]);
                          }
                        }} 
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto || isLoading}
                        className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer border border-neutral-700"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>

                      {editPhotoURL && (
                        <button
                          type="button"
                          onClick={() => setEditPhotoURL(null)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 ml-2 font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}

                      <p className="text-[10px] text-neutral-500">
                        Supports JPG, PNG or WebP. Auto-optimized for instant sync.
                      </p>
                    </div>
                  </div>

                  {/* Drag & Drop Hint */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) {
                        processImageFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 border border-dashed border-neutral-800 hover:border-neutral-600 rounded-xs py-2 px-3 text-center cursor-pointer transition-colors"
                  >
                    <span className="text-[11px] text-neutral-400">
                      or drag and drop an image file here
                    </span>
                  </div>
                </div>

                {/* 2. Change Name Section */}
                <div>
                  <label 
                    htmlFor="worldscope-edit-name-input"
                    className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5"
                  >
                    Display Name
                  </label>
                  <input
                    id="worldscope-edit-name-input"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={50}
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 rounded-none focus:outline-none transition-colors"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    This name appears on your comments, reading history and dispatches.
                  </span>
                </div>

                {/* 3. Account Email (Read-only) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Account Email (Fixed)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-neutral-950 border border-neutral-900 px-3.5 py-2 text-xs text-neutral-500 font-mono cursor-not-allowed"
                  />
                </div>

                {/* Save and Cancel Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading || isUploadingPhoto}
                    className="w-full bg-[#B80000] hover:bg-[#990000] disabled:bg-neutral-800 text-white font-bold py-2.5 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setErrorMessage(null);
                    }}
                    disabled={isLoading}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer border border-neutral-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full max-w-sm text-center animate-in fade-in duration-150">
              <div className="relative w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-white/20">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-[#006def] text-white flex items-center justify-center font-bold text-2xl">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-0.5">
                Welcome, {currentUser.name}
              </h2>
              <p className="text-xs text-neutral-400 mb-5 font-mono">
                {currentUser.email}
              </p>

              {/* Edit Profile Action Button */}
              <button
                type="button"
                onClick={() => {
                  setEditName(currentUser.name);
                  setEditPhotoURL(currentUser.photoURL || null);
                  setIsEditingProfile(true);
                  setErrorMessage(null);
                  setProfileSuccessMsg(null);
                }}
                className="w-full bg-[#B80000] hover:bg-[#990000] text-white font-bold py-2 px-4 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 mb-5 rounded-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile & Picture</span>
              </button>

              {/* Cloud Firestore Persistence & Account Details */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 text-left text-xs space-y-3 mb-6">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#006def]" />
                    Authentication Provider:
                  </span>
                  <span className="text-white font-bold capitalize">
                    {currentUser.providerId === 'google.com' ? 'Google Account' : 'WorldScope Email'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-medium flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Cloud Firestore Storage:
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Synced & Active
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-medium flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    Saved Articles:
                  </span>
                  <span className="text-white font-bold">
                    {currentUser.savedArticles?.length || 0} saved
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-medium flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-sky-400" />
                    Dispatches & Newsletters:
                  </span>
                  <span className="text-white font-bold">
                    {currentUser.subscribedNewsletters?.length || 1} active
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-2.5 text-sm uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Continue Browsing WorldScope Daily
                </button>

                <button
                  type="button"
                  onClick={handleSignOutAction}
                  disabled={isLoading}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border border-neutral-800"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5" />
                  )}
                  <span>Sign Out of WorldScope Account</span>
                </button>
              </div>
            </div>
          )
        ) : (
          /* ========================================================================= */
          /* VIEW 2: AUTHENTICATION FORM (SIGN IN OR REGISTER) */
          /* ========================================================================= */
          <div className="w-full max-w-sm text-left animate-in fade-in duration-150">
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-neutral-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className={`flex-1 py-2 text-center text-sm font-bold transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'text-white border-b-2 border-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className={`flex-1 py-2 text-center text-sm font-bold transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'text-white border-b-2 border-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Register
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white text-center leading-tight mb-2 tracking-tight font-sans">
              {mode === 'register'
                ? 'Create your WorldScope Account'
                : 'Sign in to WorldScope Daily'}
            </h1>
            <p className="text-xs text-neutral-400 text-center mb-6">
              {mode === 'register'
                ? 'Register to persist reading lists, newsletter alerts, and audio bookmarks across devices with Firestore.'
                : 'Access your saved dispatches, personalized topics, and synced preferences.'}
            </p>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 text-xs bg-red-950/80 border border-red-500 text-red-200 p-3 rounded-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span>{errorMessage}</span>
                </div>
                {(errorMessage.includes('timed out') || errorMessage.includes('blocked') || errorMessage.includes('domain')) && (
                  <div className="pt-2 text-[11px] text-neutral-300 border-t border-red-800/60 flex items-center justify-between flex-wrap gap-2">
                    <span>Need unrestricted Google popup access?</span>
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-white font-bold underline hover:text-amber-300"
                    >
                      Open in New Tab
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Info Message Alert */}
            {infoMessage && (
              <div className="mb-4 text-xs bg-emerald-950/80 border border-emerald-500 text-emerald-200 p-3 rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* GOOGLE SIGN IN BUTTON (Primary Google Auth) */}
            {/* ========================================================================= */}
            <div className="mb-5 space-y-2">
              <button
                type="button"
                id="worldscope-google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1f1f1f',
                  borderColor: '#dadce0',
                }}
                className="w-full font-bold py-2.5 px-4 text-sm transition-colors rounded-xs cursor-pointer flex items-center justify-center gap-3 border shadow-sm disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#1f1f1f]" />
                    <span className="text-[#1f1f1f] font-bold text-sm tracking-normal">
                      Connecting to Google...
                    </span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span className="text-[#1f1f1f] font-bold text-sm tracking-normal">
                      {mode === 'register' ? 'Register with Google' : 'Sign in with Google'}
                    </span>
                  </>
                )}
              </button>

              {isLoading && (
                <div className="flex items-center justify-between px-1 text-xs text-neutral-400">
                  <span>Waiting for Google authentication...</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(false);
                      setErrorMessage('Google sign-in was cancelled.');
                    }}
                    className="text-neutral-300 hover:text-white underline cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-neutral-800" />
              <span className="px-3 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                Or with email
              </span>
              <div className="flex-1 border-t border-neutral-800" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
              {/* Optional Display Name for Registration */}
              {mode === 'register' && (
                <div>
                  <label 
                    htmlFor="worldscope-auth-display-name" 
                    className="block text-neutral-300 text-xs font-medium mb-1 font-sans"
                  >
                    Display Name
                  </label>
                  <input
                    id="worldscope-auth-display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-neutral-900 text-white text-sm px-3 py-2 border border-neutral-700 focus:outline-none focus:border-[#006def] transition-colors rounded-xs"
                  />
                </div>
              )}

              <div>
                <label 
                  htmlFor="worldscope-auth-email" 
                  className="block text-neutral-300 text-xs font-medium mb-1 font-sans"
                >
                  Email Address
                </label>
                <input
                  id="worldscope-auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-900 text-white text-sm px-3 py-2 border border-neutral-700 focus:outline-none focus:border-[#006def] transition-colors rounded-xs"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="worldscope-auth-password" 
                  className="block text-neutral-300 text-xs font-medium mb-1 font-sans"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="worldscope-auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                    className="w-full bg-neutral-900 text-white text-sm px-3 py-2 pr-10 border border-neutral-700 focus:outline-none focus:border-[#006def] transition-colors rounded-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="worldscope-auth-submit-btn"
                disabled={isLoading}
                className="w-full bg-[#006def] hover:bg-[#005bd0] text-white font-bold py-3 text-sm transition-colors rounded-xs cursor-pointer font-sans flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with Firebase...</span>
                  </>
                ) : (
                  <span>
                    {mode === 'register' ? 'Create WorldScope Account' : 'Sign in to WorldScope'}
                  </span>
                )}
              </button>

              {/* Assistance & Recovery Options */}
              <div className="pt-2 flex flex-col gap-2 text-xs">
                {mode === 'signin' ? (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-[#006def] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMessage(null);
                        setInfoMessage(null);
                      }}
                      className="text-neutral-400 hover:text-white cursor-pointer"
                    >
                      New reader? <strong className="text-white hover:underline">Register</strong>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage(null);
                        setInfoMessage(null);
                      }}
                      className="text-neutral-400 hover:text-white cursor-pointer"
                    >
                      Already have an account? <strong className="text-white hover:underline">Sign In</strong>
                    </button>
                  </div>
                )}

                <div className="pt-2 text-left">
                  <button
                    type="button"
                    onClick={() => setShowHelp(!showHelp)}
                    className="text-[#006def] hover:underline font-medium cursor-pointer"
                  >
                    Why register for a WorldScope Account?
                  </button>
                </div>

                {showHelp && (
                  <div className="mt-2 p-3 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed rounded-xs animate-in fade-in">
                    <p className="font-bold text-white mb-1">Persistent Reader Experience</p>
                    <p className="mb-2">
                      With Firebase Authentication and Cloud Firestore, your saved dispatches, custom news topics, and daily briefings are securely persisted in the cloud across all devices.
                    </p>
                    <p>
                      You can register with your Google account or email. All data is protected under zero-trust Firestore security policies.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Left Footer Note */}
      <div className="w-full flex items-center justify-between text-xs text-neutral-400">
        <a 
          href="#worldscope-account-info" 
          onClick={(e) => {
            e.preventDefault();
            setShowHelp(true);
          }}
          className="hover:text-white hover:underline cursor-pointer font-medium font-sans"
        >
          Find out more about WorldScope accounts
        </a>
        <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>Cloud Firestore Persistence</span>
        </div>
      </div>
    </div>
  );
};

