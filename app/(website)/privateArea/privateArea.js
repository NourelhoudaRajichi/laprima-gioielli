// app/private/page.jsx  OR  privateArea.jsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Folder, File, Grid, List, Download, ArrowLeft, Image, FileText, Music, Video, Database, HardDrive, Archive, Search, SortAsc, SortDesc, Check, CheckSquare, Square, Eye, X, ChevronRight, Mail, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';
import './private.css';

// Color palette for folders (must match admin panel)
const FOLDER_COLORS = ['#f8e3e8', '#ec9cb2', '#004065'];
const FOLDER_TEXT_COLORS = {
  '#f8e3e8': '#333333',
  '#ec9cb2': '#000000',
  '#004065': '#ffffff'
};

// Primary colors for the application
const COLORS = {
  primary: '#004065',      // Dark blue for text, buttons, accents
  secondary: '#ec9cb2',    // Pink for hover states, secondary elements
  light: '#f8e3e8',        // Light pink for backgrounds, cards
  white: '#ffffff',
  gray: '#f5f5f5'
};

// IndexedDB Database Handler (Read-Only version)
class ClientFileDB {
  constructor() {
    this.db = null;
    this.initialized = false;
    this.initializing = null;
    this.DB_NAME = 'FileManagerDB';
    this.DB_VERSION = 8;
  }

  async init() {
    if (this.initializing) return this.initializing;

    this.initializing = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.initialized = true;
        console.log('IndexedDB initialized successfully for client');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('Client opening existing database');
      };
    });

    return this.initializing;
  }

  async ensureDB() {
    if (!this.initialized) await this.init();
    return this.db;
  }

  async getFolder(id) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['folders'], 'readonly');
      const store = transaction.objectStore('folders');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFoldersByParent(parentId = null) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['folders'], 'readonly');
      const store = transaction.objectStore('folders');
      const index = store.index('parentId');
      const request = index.getAll(parentId);
      request.onsuccess = () => {
        const folders = request.result || [];
        folders.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return (a.order || 0) - (b.order || 0);
          }
          return (a.name || '').localeCompare(b.name || '');
        });
        resolve(folders);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFolders() {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['folders'], 'readonly');
      const store = transaction.objectStore('folders');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getFilesByFolder(folderId) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const index = store.index('folderId');
      const request = index.getAll(folderId);
      request.onsuccess = () => {
        const files = request.result || [];
        files.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return (a.order || 0) - (b.order || 0);
          }
          return (a.name || '').localeCompare(b.name || '');
        });
        resolve(files);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getFile(id) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFiles() {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getFileData(fileId) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fileData'], 'readonly');
      const store = transaction.objectStore('fileData');
      const request = store.get(fileId);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getThumbnail(fileId) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction(['thumbnails'], 'readonly');
        const store = transaction.objectStore('thumbnails');
        const request = store.get(fileId);
        
        request.onsuccess = () => {
          const result = request.result?.thumbnail || null;
          resolve(result);
        };
        request.onerror = (e) => {
          console.error('❌ Error getting thumbnail:', e.target.error);
          reject(request.error);
        };
      } catch (error) {
        console.error('❌ Exception in getThumbnail:', error);
        reject(error);
      }
    });
  }

  async searchFoldersAndFiles(query, type = null) {
    await this.ensureDB();
    
    try {
      // Get all folders and files
      const [allFolders, allFiles] = await Promise.all([
        this.getAllFolders(),
        this.getAllFiles()
      ]);

      let filteredFolders = [];
      let filteredFiles = [];

      // Filter folders by name
      if (query) {
        filteredFolders = allFolders.filter(folder => 
          folder.name.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        filteredFolders = allFolders;
      }

      // Filter files
      if (query) {
        filteredFiles = allFiles.filter(file => 
          file.name.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        filteredFiles = allFiles;
      }
      
      // Apply type filter to files only
      if (type && type !== 'all') {
        filteredFiles = filteredFiles.filter(file => 
          file.type?.startsWith(type.replace('*/', ''))
        );
      }

      return { folders: filteredFolders, files: filteredFiles };
    } catch (error) {
      console.error('Error in search:', error);
      return { folders: [], files: [] };
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Thumbnail Component
const Thumbnail = ({ file, fileDB, className = "" }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadThumbnail = async () => {
      if (!file || !file.id || !fileDB) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        
        const ext = file.extension?.toLowerCase() || '';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext);
        
        // Try to get thumbnail from database first
        const thumb = await fileDB.getThumbnail(file.id);
        
        if (mounted) {
          // If thumbnail exists and is valid
          if (thumb && typeof thumb === 'string' && thumb.length > 0) {
            // Accept any base64 image or blob URL
            if (thumb.startsWith('data:') || thumb.startsWith('blob:')) {
              setThumbnail(thumb);
              setError(false);
              setLoading(false);
              return;
            }
          }
          
          // If no thumbnail but file is an image, try to load the actual file
          if (isImage) {
            try {
              const fileData = await fileDB.getFileData(file.id);
              if (fileData && mounted) {
                const blob = new Blob([fileData], { type: file.type });
                const url = URL.createObjectURL(blob);
                setThumbnail(url);
                setError(false);
                setLoading(false);
                return;
              }
            } catch (err) {
              console.error('Error loading image file data:', file.name, err);
            }
          }
          
          // If we get here, no thumbnail available
          setError(true);
        }
      } catch (error) {
        console.error('Error loading thumbnail for', file.name, ':', error);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadThumbnail();
    
    return () => {
      mounted = false;
      // Clean up blob URL if created
      if (thumbnail && thumbnail.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [file, fileDB]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`}>
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  if (thumbnail && !error) {
    return (
      <img 
        src={thumbnail} 
        alt={file.name} 
        className={`object-cover w-full h-full rounded ${className}`}
        onError={(e) => {
          console.error('Thumbnail image failed to load for:', file.name);
          setError(true);
          e.target.onerror = null;
        }}
        loading="lazy"
      />
    );
  }

  // Fallback icons when thumbnail not available
  const getFileIcon = () => {
    const ext = file?.extension?.toLowerCase() || '';
    const size = className.includes('w-') ? '' : 'w-12 h-12';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Image className={`${size} text-purple-500`} />
          <span className="text-xs text-gray-500 font-medium">{ext.toUpperCase()}</span>
        </div>
      );
    } else if (ext === 'pdf' || file.type === 'application/pdf') {
      return (
        <div className="flex flex-col items-center gap-2">
          <FileText className={`${size} text-red-500`} />
          <span className="text-xs text-gray-500 font-medium">PDF</span>
        </div>
      );
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'mpeg', 'mpg'].includes(ext)) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Video className={`${size} text-red-600`} />
          <span className="text-xs text-gray-500 font-medium">{ext.toUpperCase()}</span>
        </div>
      );
    } else if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma'].includes(ext)) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Music className={`${size} text-green-500`} />
          <span className="text-xs text-gray-500 font-medium">{ext.toUpperCase()}</span>
        </div>
      );
    } else if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Archive className={`${size} text-yellow-600`} />
          <span className="text-xs text-gray-500 font-medium">{ext.toUpperCase()}</span>
        </div>
      );
    } else if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
      return (
        <div className="flex flex-col items-center gap-2">
          <FileText className={`${size} text-blue-500`} />
          <span className="text-xs text-gray-500 font-medium">{ext.toUpperCase()}</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center gap-2">
          <File className={`${size} text-gray-400`} />
          <span className="text-xs text-gray-500 font-medium">{ext ? ext.toUpperCase() : 'FILE'}</span>
        </div>
      );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded ${className}`}>
      {getFileIcon()}
    </div>
  );
};

// Authentication Wrapper Component
export default function PrivateAreaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check both localStorage and sessionStorage
      const authToken = localStorage.getItem('clientAuthToken') || 
                       sessionStorage.getItem('clientAuthToken');
      
      const email = localStorage.getItem('clientEmail') ||
                    sessionStorage.getItem('clientEmail');
      
      if (authToken === 'true') {
        setIsAuthenticated(true);
        setUserEmail(email || 'User');
      } else {
        // Redirect to login page
        router.push('/privateAreaLogin');
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    // Clear all authentication tokens
    localStorage.removeItem('clientAuthToken');
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('clientRememberMe');
    sessionStorage.removeItem('clientAuthToken');
    sessionStorage.removeItem('clientEmail');
    
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8e3e8] to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#004065] mb-4"></div>
          <h2 className="text-xl font-semibold text-[#004065]">Checking authentication...</h2>
          <p className="text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <PrivateAreaContent onLogout={handleLogout} userEmail={userEmail} />;
}

// Main File Manager Content Component
function PrivateAreaContent({ onLogout, userEmail }) {
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileFilter, setFileFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [selectedFolders, setSelectedFolders] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState({ current: 0, total: 0 });
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFolderFiles, setCurrentFolderFiles] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [preloadedFiles, setPreloadedFiles] = useState({});
  
  const fileDB = useRef(new ClientFileDB());
  const activeBlobUrls = useRef(new Set());

  // Function to safely create and track blob URLs
  const createBlobUrl = useCallback((blob) => {
    const url = URL.createObjectURL(blob);
    activeBlobUrls.current.add(url);
    return url;
  }, []);

  // Function to safely revoke blob URLs
  const revokeBlobUrl = useCallback((url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      activeBlobUrls.current.delete(url);
    }
  }, []);

  // Clean up all blob URLs on unmount
  useEffect(() => {
    return () => {
      activeBlobUrls.current.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  useEffect(() => {
    const initializeDatabase = async () => {
      if (!dbInitialized) {
        try {
          setLoading(true);
          await fileDB.current.init();
          setDbInitialized(true);
        } catch (error) {
          console.error('Failed to initialize database:', error);
          alert('Failed to access file storage. Please make sure files are available.');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeDatabase();
  }, [dbInitialized]);

  useEffect(() => {
    const loadContents = async () => {
      if (dbInitialized && currentFolderId && !isSearching) {
        await loadFolderContents();
      }
    };

    loadContents();
  }, [dbInitialized, currentFolderId, sortBy, sortOrder, isSearching]);

  // Keyboard navigation for file preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showPreview || !previewFile || currentFolderFiles.length <= 1 || isNavigating) return;
      
      if (e.key === 'ArrowLeft') {
        navigateToFile('prev');
      } else if (e.key === 'ArrowRight') {
        navigateToFile('next');
      } else if (e.key === 'Escape') {
        handleClosePreview();
      }
    };

    if (showPreview) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showPreview, previewFile, currentFolderFiles, currentFileIndex, isNavigating]);

  // Preload adjacent files when preview is open
  useEffect(() => {
    if (showPreview && currentFolderFiles.length > 1) {
      preloadAdjacentFiles();
    }
  }, [showPreview, currentFileIndex, currentFolderFiles]);

  const preloadAdjacentFiles = useCallback(async () => {
    if (currentFolderFiles.length <= 1) return;

    const indicesToPreload = [];
    
    // Preload next and previous files
    for (let i = -1; i <= 1; i++) {
      if (i === 0) continue; // Skip current file
      const idx = (currentFileIndex + i + currentFolderFiles.length) % currentFolderFiles.length;
      indicesToPreload.push(idx);
    }

    for (const idx of indicesToPreload) {
      const file = currentFolderFiles[idx];
      if (!preloadedFiles[file.id]) {
        try {
          const fileData = await fileDB.current.getFileData(file.id);
          if (fileData) {
            const blob = new Blob([fileData], { type: file.type });
            const url = createBlobUrl(blob);
            
            setPreloadedFiles(prev => ({
              ...prev,
              [file.id]: { url, blob }
            }));
          }
        } catch (error) {
          console.error('Error preloading file:', error);
        }
      }
    }
  }, [currentFileIndex, currentFolderFiles, preloadedFiles, createBlobUrl]);

  const navigateToFile = async (direction) => {
    if (currentFolderFiles.length <= 1 || isNavigating) return;
    
    setIsNavigating(true);
    
    const newIndex = direction === 'next' 
      ? (currentFileIndex + 1) % currentFolderFiles.length
      : (currentFileIndex - 1 + currentFolderFiles.length) % currentFolderFiles.length;
    
    const newFile = currentFolderFiles[newIndex];
    
    try {
      // Store reference to current file URL before changing
      const previousUrl = previewFile?.url;
      
      setCurrentFileIndex(newIndex);
      
      // Check if file is already preloaded
      if (preloadedFiles[newFile.id]) {
        setPreviewFile({
          ...newFile,
          url: preloadedFiles[newFile.id].url,
          blob: preloadedFiles[newFile.id].blob
        });
      } else {
        // Load the file directly
        const fileData = await fileDB.current.getFileData(newFile.id);
        
        if (!fileData) {
          throw new Error('File data not found');
        }

        const blob = new Blob([fileData], { type: newFile.type });
        const url = createBlobUrl(blob);
        
        // Store in preloaded files
        setPreloadedFiles(prev => ({
          ...prev,
          [newFile.id]: { url, blob }
        }));
        
        setPreviewFile({
          ...newFile,
          url,
          blob
        });
      }
      
      // Clean up previous file URL after a delay
      if (previousUrl && previousUrl.startsWith('blob:')) {
        setTimeout(() => {
          revokeBlobUrl(previousUrl);
        }, 1000); // Keep for 1 second for smooth transitions
      }
      
      // Preload more files in background
      setTimeout(() => {
        preloadAdjacentFiles();
      }, 500);
      
    } catch (error) {
      console.error('Error navigating to file:', error);
      alert(`Failed to load file: ${error.message}`);
    } finally {
      setIsNavigating(false);
    }
  };

  const loadFolderContents = async () => {
    setLoading(true);
    try {
      const [folderList, fileList] = await Promise.all([
        fileDB.current.getFoldersByParent(currentFolderId),
        fileDB.current.getFilesByFolder(currentFolderId)
      ]);
      
      // Apply sorting to folders
      let sortedFolders = [...folderList];
      if (sortBy !== 'order' && !isSearching) {
        sortedFolders.sort((a, b) => {
          let aVal = a[sortBy];
          let bVal = b[sortBy];
          
          if (sortBy === 'name') {
            aVal = aVal?.toLowerCase() || '';
            bVal = bVal?.toLowerCase() || '';
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }
      
      setFolders(sortedFolders);
      
      // Apply sorting to files
      let sortedFiles = [...fileList];
      if (sortBy !== 'order') {
        sortedFiles.sort((a, b) => {
          let aVal = a[sortBy];
          let bVal = b[sortBy];
          
          if (sortBy === 'size') {
            aVal = aVal || 0;
            bVal = bVal || 0;
          }
          
          if (sortBy === 'name') {
            aVal = aVal?.toLowerCase() || '';
            bVal = bVal?.toLowerCase() || '';
          }
          
          if (sortBy === 'uploadedAt') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }
      
      setFiles(sortedFiles);
    } catch (error) {
      console.error('Failed to load folder contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      await loadFolderContents();
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    try {
      const searchResults = await fileDB.current.searchFoldersAndFiles(searchQuery, fileFilter);
      
      // Apply sorting to search results
      let sortedFolders = [...searchResults.folders];
      let sortedFiles = [...searchResults.files];
      
      // Sort folders
      sortedFolders.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'name') {
          aVal = aVal?.toLowerCase() || '';
          bVal = bVal?.toLowerCase() || '';
        }
        
        if (sortBy === 'uploadedAt' || sortBy === 'createdAt') {
          aVal = new Date(aVal || a.createdAt).getTime();
          bVal = new Date(bVal || b.createdAt).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      // Sort files
      sortedFiles.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'size') {
          aVal = aVal || 0;
          bVal = bVal || 0;
        }
        
        if (sortBy === 'name') {
          aVal = aVal?.toLowerCase() || '';
          bVal = bVal?.toLowerCase() || '';
        }
        
        if (sortBy === 'uploadedAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      setFolders(sortedFolders);
      setFiles(sortedFiles);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadFolderContents();
  };

  const downloadFile = async (file) => {
    try {
      setLoading(true);
      
      const fileData = await fileDB.current.getFileData(file.id);
      
      if (!fileData) {
        throw new Error('File data not found');
      }

      const blob = new Blob([fileData], { type: file.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after download
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSelectedAsZip = async () => {
    if (selectedFiles.size === 0 && selectedFolders.size === 0) {
      alert('Please select files or folders to download');
      return;
    }

    try {
      setDownloadingZip(true);
      const zip = new JSZip();
      let totalItems = selectedFiles.size + selectedFolders.size;
      let processedItems = 0;
      
      setZipProgress({ current: 0, total: totalItems });

      // Download selected files
      for (const fileId of selectedFiles) {
        try {
          const file = await fileDB.current.getFile(fileId);
          if (file) {
            const fileData = await fileDB.current.getFileData(fileId);
            if (fileData) {
              zip.file(file.name, fileData);
            }
          }
          processedItems++;
          setZipProgress({ current: processedItems, total: totalItems });
        } catch (error) {
          console.error(`Error adding file ${fileId} to zip:`, error);
        }
      }

      // Download selected folders (recursively)
      for (const folderId of selectedFolders) {
        const folder = await fileDB.current.getFolder(folderId);
        if (folder) {
          const addFolderToZip = async (folderId, folderName, zipFolder) => {
            const [subfolders, folderFiles] = await Promise.all([
              fileDB.current.getFoldersByParent(folderId),
              fileDB.current.getFilesByFolder(folderId)
            ]);
            
            for (const file of folderFiles) {
              try {
                const fileData = await fileDB.current.getFileData(file.id);
                if (fileData) {
                  zipFolder.file(file.name, fileData);
                }
              } catch (error) {
                console.error(`Error adding file ${file.name} to zip:`, error);
              }
            }
            
            for (const subfolder of subfolders) {
              const subZipFolder = zipFolder.folder(subfolder.name);
              await addFolderToZip(subfolder.id, subfolder.name, subZipFolder);
            }
          };
          
          const zipFolder = zip.folder(folder.name);
          await addFolderToZip(folder.id, folder.name, zipFolder);
          
          processedItems++;
          setZipProgress({ current: processedItems, total: totalItems });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const fileName = selectedFolders.size === 1 && selectedFiles.size === 0 
        ? `${folders.find(f => f.id === Array.from(selectedFolders)[0])?.name}.zip`
        : 'download.zip';
      
      saveAs(content, fileName);
      
      alert(`Downloaded ${totalItems} item${totalItems > 1 ? 's' : ''} as ZIP file`);
      handleClearSelection();
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      alert('Failed to create ZIP file: ' + error.message);
    } finally {
      setDownloadingZip(false);
      setZipProgress({ current: 0, total: 0 });
    }
  };

  const openFilePreview = async (file) => {
    try {
      // Get all files in the current folder for navigation
      const allFiles = await fileDB.current.getFilesByFolder(currentFolderId);
      // Filter to only previewable files
      const previewableFiles = allFiles.filter(f => {
        const ext = f.extension?.toLowerCase() || '';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
        const isVideo = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'mpeg', 'mpg','m4v'].includes(ext);
        const isAudio = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma'].includes(ext);
        const isPDF = ext === 'pdf';
        return isImage || isVideo || isAudio || isPDF;
      });
      
      const currentIndex = previewableFiles.findIndex(f => f.id === file.id);
      
      setCurrentFolderFiles(previewableFiles);
      setCurrentFileIndex(currentIndex >= 0 ? currentIndex : 0);
      
      // Determine file type
      const ext = file.extension?.toLowerCase() || '';
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
      
      let url = null;
      let blob = null;
      
      if (isImage) {
        // For images, try thumbnail first
        const thumbnail = await fileDB.current.getThumbnail(file.id);
        
        if (thumbnail && thumbnail.startsWith('data:')) {
          // Use thumbnail immediately
          url = thumbnail;
          
          // Load full version in background
          setTimeout(async () => {
            try {
              const fileData = await fileDB.current.getFileData(file.id);
              if (fileData) {
                const fullBlob = new Blob([fileData], { type: file.type });
                const fullUrl = createBlobUrl(fullBlob);
                
                if (previewFile?.id === file.id) {
                  setPreviewFile(prev => ({
                    ...prev,
                    url: fullUrl,
                    blob: fullBlob
                  }));
                }
                
                // Store in preloaded files
                setPreloadedFiles(prev => ({
                  ...prev,
                  [file.id]: { url: fullUrl, blob: fullBlob }
                }));
              }
            } catch (error) {
              console.error('Error loading full version in background:', error);
            }
          }, 100);
        } else {
          // Load full image directly
          const fileData = await fileDB.current.getFileData(file.id);
          if (fileData) {
            blob = new Blob([fileData], { type: file.type });
            url = createBlobUrl(blob);
            
            setPreloadedFiles(prev => ({
              ...prev,
              [file.id]: { url, blob }
            }));
          }
        }
      } else {
        // For videos, PDFs, audio - load directly
        const fileData = await fileDB.current.getFileData(file.id);
        if (fileData) {
          blob = new Blob([fileData], { type: file.type });
          url = createBlobUrl(blob);
          
          setPreloadedFiles(prev => ({
            ...prev,
            [file.id]: { url, blob }
          }));
        }
      }
      
      if (!url) {
        throw new Error('Could not load file for preview');
      }
      
      setPreviewFile({
        ...file,
        url,
        blob
      });
      setShowPreview(true);
      
      // Preload adjacent files
      setTimeout(() => {
        preloadAdjacentFiles();
      }, 500);
      
    } catch (error) {
      console.error('Error previewing file:', error);
      alert(`Failed to preview file: ${error.message}`);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewFile(null);
    setCurrentFileIndex(0);
    setCurrentFolderFiles([]);
    setIsNavigating(false);
    
    // Clean up preloaded files after a delay
    setTimeout(() => {
      // Clean up preloaded blob URLs
      Object.values(preloadedFiles).forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          revokeBlobUrl(file.url);
        }
      });
      setPreloadedFiles({});
    }, 1000);
  };

  const navigateToFolder = (folderId) => {
    setCurrentFolderId(folderId);
    setIsSearching(false);
    setSearchQuery('');
    handleClearSelection();
  };

  const navigateBack = async () => {
    if (currentFolderId !== 'root') {
      const currentFolder = await fileDB.current.getFolder(currentFolderId);
      if (currentFolder?.parentId) {
        setCurrentFolderId(currentFolder.parentId);
      } else {
        setCurrentFolderId('root');
      }
    }
    setIsSearching(false);
    setSearchQuery('');
    handleClearSelection();
  };

  const handleFileSelect = (fileId) => {
    const newSelectedFiles = new Set(selectedFiles);
    if (newSelectedFiles.has(fileId)) {
      newSelectedFiles.delete(fileId);
    } else {
      newSelectedFiles.add(fileId);
    }
    setSelectedFiles(newSelectedFiles);
  };

  const handleFolderSelect = (folderId) => {
    const newSelectedFolders = new Set(selectedFolders);
    if (newSelectedFolders.has(folderId)) {
      newSelectedFolders.delete(folderId);
    } else {
      newSelectedFolders.add(folderId);
    }
    setSelectedFolders(newSelectedFolders);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length && selectedFolders.size === folders.length) {
      setSelectedFiles(new Set());
      setSelectedFolders(new Set());
    } else {
      const allFileIds = files.map(file => file.id);
      const allFolderIds = folders.map(folder => folder.id);
      setSelectedFiles(new Set(allFileIds));
      setSelectedFolders(new Set(allFolderIds));
    }
  };

  const handleClearSelection = () => {
    setSelectedFiles(new Set());
    setSelectedFolders(new Set());
    setSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      handleClearSelection();
    } else {
      setSelectionMode(true);
    }
  };

  useEffect(() => {
    const updateBreadcrumb = async () => {
      if (!dbInitialized) return;
      
      const path = [];
      let currentId = currentFolderId;
      
      while (currentId) {
        try {
          const folder = await fileDB.current.getFolder(currentId);
          if (folder) {
            path.unshift(folder);
            currentId = folder.parentId;
          } else {
            break;
          }
        } catch (error) {
          console.error('Error getting folder for breadcrumb:', error);
          break;
        }
      }
      
      setBreadcrumb(path);
    };

    updateBreadcrumb();
  }, [currentFolderId, dbInitialized]);

  const FilePreviewModal = () => {
    if (!showPreview || !previewFile) return null;

    const ext = previewFile.extension?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
    const isVideo = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'mpeg', 'mpg','m4v'].includes(ext);
    const isAudio = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma'].includes(ext);
    const isPDF = ext === 'pdf';

    const handleOpenInNewTab = () => {
      if (previewFile.url) {
        window.open(previewFile.url, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={handleClosePreview}>
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
          {/* Loading Overlay */}
          {isNavigating && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-[#004065] animate-spin mb-2" />
                <p className="text-[#004065] font-medium">Loading...</p>
              </div>
            </div>
          )}
          
          {/* Navigation Arrows */}
          {currentFolderFiles.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isNavigating) navigateToFile('prev');
                }}
                disabled={isNavigating}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous file"
              >
                <ArrowLeft className="w-6 h-6 text-[#004065]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isNavigating) navigateToFile('next');
                }}
                disabled={isNavigating}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next file"
              >
                <ArrowLeft className="w-6 h-6 text-[#004065] transform rotate-180" />
              </button>
              
              {/* File counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm z-10">
                {currentFileIndex + 1} / {currentFolderFiles.length}
              </div>
            </>
          )}
          
          <div className="flex items-center justify-between p-4 border-b">
            <div className="min-w-0">
              <h3 className="font-semibold text-lg truncate text-[#004065]">{previewFile.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {fileDB.current.formatFileSize(previewFile.size)} • {ext.toUpperCase()}
                {currentFolderFiles.length > 1 && ` • File ${currentFileIndex + 1} of ${currentFolderFiles.length}`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {currentFolderFiles.length > 1 && (
                <div className="flex items-center gap-1 mr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isNavigating) navigateToFile('prev');
                    }}
                    disabled={isNavigating}
                    className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065] disabled:opacity-50"
                    title="Previous file"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isNavigating) navigateToFile('next');
                    }}
                    disabled={isNavigating}
                    className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065] disabled:opacity-50"
                    title="Next file"
                  >
                    <ArrowLeft className="w-4 h-4 transform rotate-180" />
                  </button>
                </div>
              )}
              {isPDF && (
                <button
                  onClick={handleOpenInNewTab}
                  className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065]"
                  title="Open in New Tab"
                >
                  <Eye className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => {
                  downloadFile(previewFile);
                }}
                className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065]"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleClosePreview}
                className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] relative">
            {isImage && (
              <div className="flex items-center justify-center relative min-h-[300px]">
                <img 
                  src={previewFile.url} 
                  alt={previewFile.name} 
                  className="max-w-full h-auto max-h-[70vh] object-contain transition-opacity duration-300"
                  style={{ opacity: isNavigating ? 0.7 : 1 }}
                  key={previewFile.id + (isNavigating ? '-loading' : '-loaded')}
                  onError={(e) => {
                    console.error('Image failed to load:', previewFile.url);
                    e.target.src = '/img/fallback-image.png';
                  }}
                />
              </div>
            )}
            {isVideo && (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                  <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                    <video 
                      controls 
                      autoPlay
                      className="w-full h-auto max-h-[70vh]"
                      key={previewFile.id + '-' + Date.now()} // Force re-render with new key
                    >
                      <source 
                        src={previewFile.url} 
                        type={previewFile.type || 'video/mp4'}
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  {previewFile.type && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Video format: {previewFile.type}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-3 items-center justify-center">
                  <button
                    onClick={handleOpenInNewTab}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition-all duration-200 shadow-md font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Open Video in New Tab
                  </button>
                  <button
                    onClick={() => downloadFile(previewFile)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#e68ba6] transition-all duration-200 shadow-md font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Video
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center mt-3">
                  If the video doesn&apos;t play, try opening in a new tab or downloading it.
                </p>
              </div>
            )}
            {isAudio && (
              <div className="flex items-center justify-center p-8 relative">
                <div className="w-full max-w-2xl">
                  <div className="bg-gradient-to-br from-[#f8e3e8] to-[#ec9cb2]/20 rounded-xl p-8 shadow-lg">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Music className="w-10 h-10 text-[#004065]" />
                      </div>
                    </div>
                    <h4 className="text-center text-[#004065] font-semibold mb-4 truncate">{previewFile.name}</h4>
                    <audio 
                      controls 
                      autoPlay
                      className="w-full"
                      key={previewFile.id}
                    >
                      <source src={previewFile.url} type={previewFile.type || 'audio/mpeg'} />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                </div>
              </div>
            )}
            {isPDF && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50" style={{ height: '65vh' }}>
                  <iframe 
                    src={`${previewFile.url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                    className="w-full h-full"
                    title={previewFile.name}
                    style={{ border: 'none' }}
                    key={previewFile.id}
                  />
                </div>
                <div className="flex gap-3 items-center justify-center">
                  <button
                    onClick={handleOpenInNewTab}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition-all duration-200 shadow-md font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => downloadFile(previewFile)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#e68ba6] transition-all duration-200 shadow-md font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  PDF preview may not work in all browsers. Use &quot;Open in New Tab&quot; for best experience.
                </p>
              </div>
            )}
            {!isImage && !isVideo && !isAudio && !isPDF && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-[#f8e3e8] to-[#ec9cb2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <File className="w-10 h-10 text-[#004065]" />
                </div>
                <h4 className="text-xl font-semibold text-[#004065] mb-2">Preview Not Available</h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">This file type cannot be previewed in the browser</p>
                <button
                  onClick={() => {
                    downloadFile(previewFile);
                    handleClosePreview();
                  }}
                  className="px-6 py-3 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition-all duration-200 shadow-md font-medium"
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Download File ({fileDB.current.formatFileSize(previewFile.size)})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!dbInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8e3e8] to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#004065] mb-4"></div>
          <h2 className="text-xl font-semibold text-[#004065]">Loading File Manager...</h2>
          <p className="text-gray-500 mt-2">Initializing file storage</p>
        </div>
      </div>
    );
  }

  const totalSelected = selectedFiles.size + selectedFolders.size;
  const allSelected = files.length > 0 && folders.length > 0 && 
                     selectedFiles.size === files.length && 
                     selectedFolders.size === folders.length;

  return (
    <div className="min-h-screen ">
      <FilePreviewModal />
      
      {downloadingZip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-[#004065]">Creating ZIP File...</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-[#004065] font-medium">{zipProgress.current} / {zipProgress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#004065] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${zipProgress.total > 0 ? (zipProgress.current / zipProgress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">Please wait while we prepare your download...</p>
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <header className="bg-white shadow-sm">
        {/* Top Section with Logo - White Background */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* Logo in the Middle */}
              <div className="absolute left-1/2 -translate-x-1/2 transform">
                <img 
                  src="/img/La-Prima-Logo.png"
                  alt="La Prima Gioielli" 
                  className="h-8"
                />
              </div>
              
              {/* User Info and Logout on Right Side */}
              <div className="flex-1 flex items-center justify-end gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-gray-500 text-sm">Welcome,</p>
                  <p className="text-[#004065] font-medium">{userEmail}</p>
                </div>
                <div className="h-10 w-px bg-gray-300 hidden md:block"></div>
                <button
                  onClick={onLogout}
                  className="px-6 py-2.5 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#e68ba6] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Background Image Section */}
        <div 
          className="relative h-[28rem] bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://laprimagioielli.com/wp-content/uploads/2025/09/BLOOMY-WEB-scaled.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
        </div>

        {/* Welcome Message Banner - White Background */}
        <div className="bg-white py-4 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-[#004065] font-medium">
                  La Prima Gioielli welcomes you to the reserved area for commercial partners.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Below you can find the marketing material available for download.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <Mail className="w-4 h-4 text-[#ec9cb2]" />
                <div>
                  <p className="text-xs text-gray-500">Need assistance?</p>
                  <a 
                    href="mailto:marketing@laprimagioielli.it"
                    className="text-[#004065] font-medium text-sm hover:text-[#ec9cb2] transition-colors"
                  >
                    marketing@laprimagioielli.it
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm flex-wrap bg-white px-4 py-3 rounded-lg shadow-sm border border-[#ec9cb2]/20">
          <button
            onClick={() => navigateToFolder('root')}
            className="text-[#004065] hover:text-[#ec9cb2] font-medium flex items-center gap-1 transition-colors"
          >
            <HardDrive className="w-4 h-4" />
            Home
          </button>
          {breadcrumb.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => navigateToFolder(folder.id)}
                className="text-[#004065] hover:text-[#ec9cb2] font-medium transition-colors"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
          {isSearching && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-medium">Search Results</span>
            </>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                selectionMode 
                  ? 'bg-[#004065] text-white hover:bg-[#003154] shadow-md' 
                  : 'bg-white text-[#004065] hover:bg-[#f8e3e8] border border-[#ec9cb2] shadow-sm'
              }`}
            >
              {selectionMode ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  <span className="font-medium">Selection Mode</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  <span className="font-medium">Select Items</span>
                </>
              )}
            </button>
            
            {selectionMode && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
                
                {totalSelected > 0 && (
                  <button
                    onClick={downloadSelectedAsZip}
                    disabled={downloadingZip}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#e68ba6] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Selected ({totalSelected})
                  </button>
                )}
              </>
            )}

            {currentFolderId !== 'root' && !isSearching && (
              <button
                onClick={navigateBack}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#004065] border border-[#ec9cb2] rounded-lg hover:bg-[#f8e3e8] transition-all duration-200 shadow-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search Section */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search files and folders..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-[#ec9cb2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004065]/20 focus:border-[#004065] bg-white shadow-sm"
                />
              </div>
              
              <button
                onClick={handleSearch}
                className="px-4 py-2.5 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                Search
              </button>
              
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2.5 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#e68ba6] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Filters and Views */}
            <div className="flex items-center gap-2">
              <select
                value={fileFilter}
                onChange={(e) => setFileFilter(e.target.value)}
                className="px-4 py-2.5 border border-[#ec9cb2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004065]/20 focus:border-[#004065] bg-white shadow-sm text-[#004065] font-medium"
              >
                <option value="all">All Files</option>
                <option value="image/">Images</option>
                <option value="video/">Videos</option>
                <option value="audio/">Audio</option>
                <option value="application/pdf">PDFs</option>
                <option value="text/">Text Files</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-[#ec9cb2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004065]/20 focus:border-[#004065] bg-white shadow-sm text-[#004065] font-medium"
              >
                <option value="order">Sort by Position</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
                <option value="uploadedAt">Sort by Date</option>
                <option value="type">Sort by Type</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 border border-[#ec9cb2] rounded-lg hover:bg-[#f8e3e8] transition-all duration-200 bg-white shadow-sm"
              >
                {sortOrder === 'asc' ? 
                  <SortAsc className="w-5 h-5 text-[#004065]" /> : 
                  <SortDesc className="w-5 h-5 text-[#004065]" />
                }
              </button>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-[#004065] text-white' 
                      : 'hover:bg-[#f8e3e8] border border-[#ec9cb2] bg-white text-[#004065]'
                  } shadow-sm`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-[#004065] text-white' 
                      : 'hover:bg-[#f8e3e8] border border-[#ec9cb2] bg-white text-[#004065]'
                  } shadow-sm`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#ec9cb2]/20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#004065]"></div>
            <p className="mt-4 text-[#004065]">Loading files...</p>
          </div>
        ) : folders.length === 0 && files.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#ec9cb2]/20">
            <div className="w-20 h-20 bg-gradient-to-br from-[#f8e3e8] to-[#ec9cb2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Folder className="w-10 h-10 text-[#004065]" />
            </div>
            <h3 className="text-xl font-bold text-[#004065] mb-2">
              {isSearching ? 'No files or folders found' : 'This folder is empty'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isSearching ? 'Try a different search term' : 'No files available in this folder'}
            </p>
            {isSearching && (
              <button
                onClick={clearSearch}
                className="px-4 py-2.5 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition-all duration-200 shadow-md"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 text-[#004065]">
                  {isSearching ? 'Found Folders' : 'Folders'} ({folders.length})
                </h2>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-3'}>
                  {folders.map((folder) => (
                    <div key={folder.id} className="relative group">
                      {viewMode === 'grid' ? (
                        <div className="relative">
                          <div
                            className={`rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 transform shadow-lg min-h-[120px] flex flex-col justify-between border-2 ${
                              selectedFolders.has(folder.id) 
                                ? 'border-[#004065] ring-2 ring-[#004065]/20' 
                                : 'border-transparent'
                            }`}
                            style={{ 
                              backgroundColor: folder.color || FOLDER_COLORS[0],
                              color: FOLDER_TEXT_COLORS[folder.color] || '#333333'
                            }}
                            onClick={() => selectionMode ? handleFolderSelect(folder.id) : navigateToFolder(folder.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Folder className="w-10 h-10" style={{ opacity: 0.9 }} />
                              {selectionMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFolderSelect(folder.id);
                                  }}
                                  className={`p-1.5 rounded-full ${
                                    selectedFolders.has(folder.id) 
                                      ? 'bg-[#004065] text-white' 
                                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                                  }`}
                                  style={{ 
                                    color: FOLDER_TEXT_COLORS[folder.color] || '#333333'
                                  }}
                                >
                                  {selectedFolders.has(folder.id) ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm truncate">{folder.name}</h3>
                              <p className="text-xs opacity-90 mt-1">
                                {isSearching ? 'Click to open' : 'Click to browse'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-between p-5 rounded-xl hover:shadow-md cursor-pointer border transition-all duration-200 ${
                            selectedFolders.has(folder.id) 
                              ? 'bg-[#004065]/5 border-[#004065]' 
                              : 'bg-white border-[#ec9cb2]/30 hover:border-[#ec9cb2]'
                          }`}
                          onClick={() => selectionMode ? handleFolderSelect(folder.id) : navigateToFolder(folder.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                              {selectionMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFolderSelect(folder.id);
                                  }}
                                  className={`p-1.5 rounded-lg ${
                                    selectedFolders.has(folder.id) 
                                      ? 'bg-[#004065] text-white' 
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}
                                >
                                  {selectedFolders.has(folder.id) ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                                style={{ backgroundColor: folder.color || FOLDER_COLORS[0] }}
                              >
                                <Folder className="w-6 h-6" 
                                  style={{ color: FOLDER_TEXT_COLORS[folder.color] || '#333333' }}
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#004065]">{folder.name}</h3>
                              <p className="text-sm text-gray-500">
                                {isSearching ? 'Click to open folder' : 'Click to browse folder contents'}
                                {isSearching && folder.parentId && folder.parentId !== 'root' && (
                                  <span className="block text-xs text-gray-400">
                                    Path: {folder.path || 'Unknown'}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {!selectionMode && (
                            <div className="text-[#ec9cb2]">
                              <ArrowLeft className="w-5 h-5 transform rotate-180" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-[#004065]">
                  {isSearching ? 'Found Files' : 'Files'} ({files.length})
                </h2>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-3'}>
                  {files.map((file) => (
                    <div key={file.id} className="relative group">
                      {viewMode === 'grid' ? (
                        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col border border-[#ec9cb2]/20 hover:border-[#ec9cb2]">
                          <div 
                            className={`flex justify-center items-center mb-3 h-32 bg-gradient-to-br from-[#f8e3e8] to-gray-50 rounded-lg overflow-hidden ${
                              selectedFiles.has(file.id) 
                                ? 'ring-2 ring-[#004065] ring-offset-2' 
                                : ''
                            }`}
                            onClick={() => selectionMode ? handleFileSelect(file.id) : openFilePreview(file)}
                          >
                            <Thumbnail file={file} fileDB={fileDB.current} className="w-full h-full" />
                          </div>
                          <div className="mt-2 flex-1">
                            <h3 className="font-medium text-sm truncate mb-1 text-[#004065]" title={file.name}>
                              {file.name}
                            </h3>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">{fileDB.current.formatFileSize(file.size)}</span>
                              <span className="text-[#004065] font-medium">{file.extension?.toUpperCase() || 'FILE'}</span>
                            </div>
                            {isSearching && file.folderId && (
                              <p className="text-xs text-gray-400 mt-1 truncate">
                                In: {file.folderId === 'root' ? 'Home' : 'Folder'}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            {selectionMode ? (
                              <button
                                onClick={() => handleFileSelect(file.id)}
                                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                                  selectedFiles.has(file.id)
                                    ? 'bg-[#004065] text-white hover:bg-[#003154]'
                                    : 'bg-[#f8e3e8] text-[#004065] hover:bg-[#ec9cb2] hover:text-white'
                                } font-medium`}
                              >
                                {selectedFiles.has(file.id) ? 'Selected' : 'Select'}
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => openFilePreview(file)}
                                  className="flex-1 px-3 py-2 bg-[#004065] text-white text-xs rounded-lg hover:bg-[#003154] transition-all duration-200 font-medium"
                                >
                                  Preview
                                </button>
                                <button
                                  onClick={() => downloadFile(file)}
                                  className="flex-1 px-3 py-2 bg-[#ec9cb2] text-white text-xs rounded-lg hover:bg-[#e68ba6] transition-all duration-200 font-medium"
                                >
                                  Download
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`flex items-center justify-between p-5 rounded-xl hover:shadow-md border cursor-pointer transition-all duration-200 ${
                            selectedFiles.has(file.id) 
                              ? 'bg-[#004065]/5 border-[#004065]' 
                              : 'bg-white border-[#ec9cb2]/30 hover:border-[#ec9cb2]'
                          }`}
                          onClick={() => selectionMode ? handleFileSelect(file.id) : openFilePreview(file)}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex-shrink-0 flex items-center">
                              {selectionMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileSelect(file.id);
                                  }}
                                  className={`p-1.5 rounded-lg mr-3 ${
                                    selectedFiles.has(file.id) 
                                      ? 'bg-[#004065] text-white' 
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}
                                >
                                  {selectedFiles.has(file.id) ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              <Thumbnail file={file} fileDB={fileDB.current} className="w-12 h-12 rounded-lg shadow-sm" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-[#004065] truncate">{file.name}</h3>
                              <p className="text-sm text-gray-500">
                                {fileDB.current.formatFileSize(file.size)} • <span className="text-[#004065] font-medium">{file.extension?.toUpperCase() || 'FILE'}</span> • 
                                Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                                {isSearching && file.folderId && (
                                  <span className="block text-xs text-gray-400">
                                    Location: {file.folderId === 'root' ? 'Home' : 'In a folder'}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!selectionMode && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFilePreview(file);
                                  }}
                                  className="p-2.5 text-[#004065] hover:bg-[#004065]/10 rounded-lg transition-all duration-200"
                                  title="Preview file"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(file);
                                  }}
                                  className="p-2.5 bg-[#ec9cb2] text-white hover:bg-[#e68ba6] rounded-lg transition-all duration-200 shadow-sm"
                                  title="Download file"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main> 
    </div>
  );
}