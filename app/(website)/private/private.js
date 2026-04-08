"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, Grid, List, Settings, Lock, Plus, Trash2, Download, Upload, ArrowLeft, FolderPlus, Image, FileText, Music, Video, X, Eye, Database, HardDrive, Archive, Search, SortAsc, SortDesc, Check, CheckSquare, Square, Edit, GripVertical, Filter } from 'lucide-react';
import './private.css'

// IndexedDB Database Handler
class FileDB {
  constructor() {
    this.db = null;
    this.initialized = false;
    this.initializing = null;
    this.DB_NAME = 'FileManagerDB';
    this.DB_VERSION = 8; // ← bumped from 7 to 8 to force schema upgrade
  }

  async init() {
    if (this.initializing) return this.initializing;

    this.initializing = new Promise((resolve, reject) => {
      // Delete and recreate if there's a version mismatch by catching blockedError
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };

      request.onblocked = () => {
        console.warn('IndexedDB upgrade blocked — close other tabs using this app');
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.initialized = true;
        console.log('IndexedDB initialized successfully, version:', this.db.version);
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('Creating/upgrading database from version', event.oldVersion, '→', event.newVersion);

        if (!db.objectStoreNames.contains('folders')) {
          const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
          folderStore.createIndex('parentId', 'parentId', { unique: false });
          folderStore.createIndex('name', 'name', { unique: false });
          folderStore.createIndex('order', 'order', { unique: false });
          folderStore.createIndex('color', 'color', { unique: false });
        }

        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'id' });
          fileStore.createIndex('folderId', 'folderId', { unique: false });
          fileStore.createIndex('name', 'name', { unique: false });
          fileStore.createIndex('type', 'type', { unique: false });
          fileStore.createIndex('size', 'size', { unique: false });
          fileStore.createIndex('uploadedAt', 'uploadedAt', { unique: false });
          fileStore.createIndex('order', 'order', { unique: false });
        }

        if (!db.objectStoreNames.contains('thumbnails')) {
          db.createObjectStore('thumbnails', { keyPath: 'fileId' });
        }

        if (!db.objectStoreNames.contains('fileData')) {
          db.createObjectStore('fileData', { keyPath: 'fileId' });
        }
      };
    });

    return this.initializing;
  }

  async ensureDB() {
    if (!this.initialized) await this.init();
    return this.db;
  }

  async saveFolder(folder) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['folders'], 'readwrite');
      const store = transaction.objectStore('folders');
      const request = store.put(folder);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateFolder(id, updates) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['folders'], 'readwrite');
      const store = transaction.objectStore('folders');

      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const folder = getRequest.result;
        if (!folder) {
          reject(new Error('Folder not found'));
          return;
        }

        const updatedFolder = { ...folder, ...updates };
        const putRequest = store.put(updatedFolder);
        putRequest.onsuccess = () => resolve(updatedFolder);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
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

  async saveFile(file) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.put(file);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateFile(id, updates) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');

      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const file = getRequest.result;
        if (!file) {
          reject(new Error('File not found'));
          return;
        }

        const updatedFile = { ...file, ...updates };
        const putRequest = store.put(updatedFile);
        putRequest.onsuccess = () => resolve(updatedFile);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async saveFileData(fileId, data) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fileData'], 'readwrite');
      const store = transaction.objectStore('fileData');
      const request = store.put({ fileId, data });
      request.onsuccess = () => resolve();
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

  async saveThumbnail(fileId, thumbnail) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction(['thumbnails'], 'readwrite');
        const store = transaction.objectStore('thumbnails');
        const request = store.put({ fileId, thumbnail });

        request.onsuccess = () => {
          console.log('✅ Thumbnail saved to IndexedDB for fileId:', fileId);
          resolve();
        };
        request.onerror = (e) => {
          console.error('❌ Error saving thumbnail:', e.target.error);
          reject(request.error);
        };
      } catch (error) {
        console.error('❌ Exception in saveThumbnail:', error);
        reject(error);
      }
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
          console.log('🔍 Thumbnail retrieval for', fileId, ':', result ? 'Found' : 'Not found');
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

  async deleteFile(fileId) {
    await this.ensureDB();
    const transaction = this.db.transaction(['files', 'thumbnails', 'fileData'], 'readwrite');

    return Promise.all([
      new Promise((resolve, reject) => {
        const store = transaction.objectStore('files');
        const request = store.delete(fileId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise((resolve, reject) => {
        const store = transaction.objectStore('thumbnails');
        const request = store.delete(fileId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise((resolve, reject) => {
        const store = transaction.objectStore('fileData');
        const request = store.delete(fileId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      })
    ]);
  }

  async deleteFolder(folderId) {
    await this.ensureDB();

    const files = await this.getFilesByFolder(folderId);
    await Promise.all(files.map(file => this.deleteFile(file.id)));

    const subfolders = await this.getFoldersByParent(folderId);
    await Promise.all(subfolders.map(folder => this.deleteFolder(folder.id)));

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['folders'], 'readwrite');
      const store = transaction.objectStore('folders');
      const request = store.delete(folderId);
      request.onsuccess = () => resolve();
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

  async getStorageUsage() {
    try {
      await this.ensureDB();

      if (!navigator.storage || typeof navigator.storage.estimate !== 'function') {
        return {
          usage: 0,
          quota: 500 * 1024 * 1024 * 1024,
          percentage: 0,
          usedFormatted: this.formatFileSize(0),
          maxFormatted: this.formatFileSize(500 * 1024 * 1024 * 1024)
        };
      }

      const { usage, quota } = await navigator.storage.estimate();
      const effectiveQuota = quota || 500 * 1024 * 1024 * 1024;
      const effectiveUsage = usage || 0;

      return {
        usage: effectiveUsage,
        quota: effectiveQuota,
        percentage: effectiveQuota > 0 ? (effectiveUsage / effectiveQuota) * 100 : 0,
        usedFormatted: this.formatFileSize(effectiveUsage),
        maxFormatted: this.formatFileSize(effectiveQuota)
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return {
        usage: 0,
        quota: 500 * 1024 * 1024 * 1024,
        percentage: 0,
        usedFormatted: this.formatFileSize(0),
        maxFormatted: this.formatFileSize(500 * 1024 * 1024 * 1024)
      };
    }
  }

  async searchFiles(query, type = null, includeFolders = false) {
    await this.ensureDB();
    let results = [];

    const allFiles = await this.getAllFiles();
    let filteredFiles = allFiles;

    if (query) {
      filteredFiles = filteredFiles.filter(file =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type && type !== 'all' && type !== 'folders') {
      filteredFiles = filteredFiles.filter(file =>
        file.type?.startsWith(type.replace('*/', ''))
      );
    }

    results = filteredFiles;

    if (includeFolders || type === 'folders') {
      const allFolders = await this.getAllFolders();
      let filteredFolders = allFolders;

      if (query) {
        filteredFolders = filteredFolders.filter(folder =>
          folder.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      results = [...results, ...filteredFolders.map(folder => ({
        ...folder,
        isFolder: true,
        type: 'folder'
      }))];
    }

    return results;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Color palette for folders
const FOLDER_COLORS = ['#f8e3e8', '#ec9cb2', '#004065'];
const FOLDER_TEXT_COLORS = {
  '#f8e3e8': '#333333',
  '#ec9cb2': '#000000',
  '#004065': '#ffffff'
};

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

        const thumb = await fileDB.getThumbnail(file.id);

        if (mounted) {
          if (thumb && typeof thumb === 'string' && thumb.startsWith('data:image')) {
            console.log('✅ Thumbnail loaded for:', file.name);
            setThumbnail(thumb);
            setError(false);
          } else {
            console.log('⚠️ No thumbnail found for:', file.name);
            setError(true);
          }
        }
      } catch (error) {
        console.error('❌ Error loading thumbnail for', file.name, ':', error);
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
          console.error('❌ Thumbnail image failed to render for:', file.name);
          setError(true);
          e.target.onerror = null;
        }}
        loading="lazy"
      />
    );
  }

  const getFileIcon = () => {
    const ext = file?.extension?.toLowerCase() || '';
    const size = className.includes('w-') ? '' : 'w-12 h-12';

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
      return <Image className={`${size} text-purple-500`} />;
    } else if (ext === 'pdf' || file.type === 'application/pdf') {
      return <FileText className={`${size} text-red-500`} />;
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'mpeg', 'mpg'].includes(ext)) {
      return <Video className={`${size} text-red-500`} />;
    } else if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma'].includes(ext)) {
      return <Music className={`${size} text-green-500`} />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
      return <Archive className={`${size} text-yellow-500`} />;
    } else if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
      return <FileText className={`${size} text-blue-500`} />;
    } else {
      return <File className={`${size} text-gray-400`} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded ${className}`}>
      {getFileIcon()}
    </div>
  );
};

// Folder color picker component
const FolderColorPicker = ({ folderId, currentColor, onColorChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPicker(!showPicker);
        }}
        className="p-1.5 rounded-full hover:bg-gray-100 transition"
        title="Change folder color"
      >
        <div
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: currentColor }}
        />
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-20 min-w-[140px]">
            <div className="flex gap-2 mb-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    onColorChange(folderId, color);
                    setShowPicker(false);
                  }}
                  className={`w-8 h-8 rounded-full border-2 ${currentColor === color ? 'border-blue-500' : 'border-gray-200'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Thumbnail Generators
const generateImageThumbnail = (file) => {
  return new Promise((resolve) => {
    console.log('🖼️ Starting image thumbnail generation for:', file.name, 'Size:', file.size, 'bytes');

    const timeout = setTimeout(() => {
      console.error('❌ Image thumbnail generation TIMEOUT after 10 seconds');
      resolve(null);
    }, 10000);

    const reader = new FileReader();

    reader.onload = (e) => {
      console.log('📖 FileReader loaded successfully, result length:', e.target.result?.length);
      try {
        const img = new Image();

        img.onload = () => {
          clearTimeout(timeout);
          try {
            console.log('🎨 Image loaded, dimensions:', img.width, 'x', img.height);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: false });

            if (!ctx) {
              console.error('❌ Failed to get canvas context');
              resolve(null);
              return;
            }

            const maxSize = 400;

            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxSize) {
                height = Math.round((height * maxSize) / width);
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width = Math.round((width * maxSize) / height);
                height = maxSize;
              }
            }

            width = Math.max(1, width);
            height = Math.max(1, height);

            console.log('📐 Resized to:', width, 'x', height);

            canvas.width = width;
            canvas.height = height;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            console.log('🎨 Drawing complete, converting to DataURL...');
            const thumbnail = canvas.toDataURL('image/jpeg', 0.9);
            console.log('✅ Image thumbnail created successfully! Size:', thumbnail.length, 'characters');
            resolve(thumbnail);
          } catch (error) {
            clearTimeout(timeout);
            console.error('❌ Error drawing image to canvas:', error);
            resolve(null);
          }
        };

        img.onerror = (error) => {
          clearTimeout(timeout);
          console.error('❌ Image load error:', error);
          resolve(null);
        };

        console.log('🔗 Setting image src from FileReader result...');
        img.src = e.target.result;
      } catch (error) {
        clearTimeout(timeout);
        console.error('❌ Exception in image thumbnail onload:', error);
        resolve(null);
      }
    };

    reader.onerror = (error) => {
      clearTimeout(timeout);
      console.error('❌ FileReader error:', error);
      resolve(null);
    };

    try {
      console.log('📂 Starting to read file as DataURL...');
      reader.readAsDataURL(file);
    } catch (error) {
      clearTimeout(timeout);
      console.error('❌ Exception starting FileReader:', error);
      resolve(null);
    }
  });
};

const generatePDFThumbnail = async (pdfFile) => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 390;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 390);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, 300, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PDF', 150, 25);

      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(20, 70, 260, 300);

      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 80, 240, 280);

      ctx.fillStyle = '#e5e7eb';
      const lineHeight = 20;
      const startY = 100;

      for (let i = 0; i < 10; i++) {
        const y = startY + i * lineHeight;
        const lineWidth = i % 3 === 0 ? 180 : 200;
        ctx.fillRect(45, y, lineWidth, 3);
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const fileName = pdfFile.name.length > 30 ? pdfFile.name.substring(0, 27) + '...' : pdfFile.name;
      ctx.fillText(fileName, 150, 365);

      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, 300, 390);

      const thumbnail = canvas.toDataURL('image/png', 0.9);
      console.log('✅ PDF thumbnail created');
      resolve(thumbnail);
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error);
      resolve(null);
    }
  });
};

const generateVideoThumbnail = (videoFile) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    let seeked = false;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      if (seeked) return;
      seeked = true;

      try {
        const maxSize = 300;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        const thumbnail = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(video.src);
        console.log('✅ Video thumbnail created');
        resolve(thumbnail);
      } catch (error) {
        console.error('Error capturing video frame:', error);
        URL.revokeObjectURL(video.src);
        resolve(null);
      }
    };

    video.onerror = () => {
      console.error('Video load error');
      URL.revokeObjectURL(video.src);
      resolve(null);
    };

    setTimeout(() => {
      if (!seeked) {
        URL.revokeObjectURL(video.src);
        resolve(null);
      }
    }, 5000);

    video.src = URL.createObjectURL(videoFile);
  });
};

const generateDocThumbnail = async (extension) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 260;
    const ctx = canvas.getContext('2d');

    let headerColor = '#2563eb';
    if (extension === 'xls' || extension === 'xlsx') headerColor = '#16a34a';
    if (extension === 'ppt' || extension === 'pptx') headerColor = '#ea580c';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 260);
    ctx.fillStyle = headerColor;
    ctx.fillRect(0, 0, 200, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(extension.toUpperCase(), 100, 42);
    ctx.fillStyle = '#f3f4f6';
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(20, 80 + i * 20, 160, 12);
    }
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 200, 260);

    resolve(canvas.toDataURL('image/png', 0.8));
  });
};

const generateAudioThumbnail = async () => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 300, 300);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.5, '#059669');
    gradient.addColorStop(1, '#047857');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 300);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(100, 210, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(180, 195, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(130, 90, 12, 125);
    ctx.fillRect(210, 75, 12, 125);
    ctx.fillRect(130, 75, 92, 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AUDIO', 150, 270);

    resolve(canvas.toDataURL('image/png', 0.9));
  });
};

export default function FileManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showSettings, setShowSettings] = useState(false);
  const [displayStyle, setDisplayStyle] = useState('modern');
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [storageUsage, setStorageUsage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileFilter, setFileFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [selectedFolders, setSelectedFolders] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [editName, setEditName] = useState('');

  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingItemType, setDraggingItemType] = useState(null);
  const [dragOverFolderId, setDragOverFolderId] = useState(null);
  const [dragOverFileId, setDragOverFileId] = useState(null);

  const fileDB = useRef(new FileDB());
  const fileInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      if (isAuthenticated && !dbInitialized) {
        try {
          setLoading(true);
          await fileDB.current.init();
          setDbInitialized(true);

          const rootFolder = await fileDB.current.getFolder('root');
          if (!rootFolder) {
            await fileDB.current.saveFolder({
              id: 'root',
              name: 'Home',
              parentId: null,
              color: FOLDER_COLORS[0],
              createdAt: new Date().toISOString(),
              path: '/',
              order: 0
            });
          }

          await loadStorageUsage();
        } catch (error) {
          console.error('Failed to initialize database:', error);
          alert('Failed to initialize storage. Please refresh the page.');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeDatabase();
  }, [isAuthenticated, dbInitialized]);

  useEffect(() => {
    const loadContents = async () => {
      if (isAuthenticated && dbInitialized && currentFolderId && !isSearching) {
        await loadFolderContents();
      }
    };

    loadContents();
  }, [isAuthenticated, dbInitialized, currentFolderId, sortBy, sortOrder, isSearching]);

  const loadFolderContents = async () => {
    setLoading(true);
    try {
      const [folderList, fileList] = await Promise.all([
        fileDB.current.getFoldersByParent(currentFolderId),
        fileDB.current.getFilesByFolder(currentFolderId)
      ]);

      setFolders(folderList);

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

  const loadStorageUsage = async () => {
    try {
      const usage = await fileDB.current.getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Failed to load storage usage:', error);
    }
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password! Use "admin123"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setCurrentFolderId('root');
    setDbInitialized(false);
    setFolders([]);
    setFiles([]);
    setStorageUsage(null);
    handleClearSelection();
  };

  const createFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    const folder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      parentId: currentFolderId,
      color: FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)],
      createdAt: new Date().toISOString(),
      path: `${currentFolderId === 'root' ? '' : currentFolderId}/${name}`,
      order: folders.length
    };

    try {
      await fileDB.current.saveFolder(folder);
      await loadFolderContents();
      await loadStorageUsage();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  const changeFolderColor = async (folderId, color) => {
    try {
      await fileDB.current.updateFolder(folderId, { color });
      await loadFolderContents();
    } catch (error) {
      console.error('Error changing folder color:', error);
      alert('Failed to change folder color');
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;

    for (const file of uploadedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large. Maximum file size is 2GB.`);
        continue;
      }

      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const extension = file.name.split('.').pop().toLowerCase();

      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { loaded: 0, total: file.size, name: file.name }
      }));

      try {
        let thumbnail = null;

        console.log('📁 Uploading:', file.name, 'Type:', file.type, 'Extension:', extension);

        if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
          console.log('🖼️ Image detected! Generating thumbnail...');
          try {
            thumbnail = await generateImageThumbnail(file);
          } catch (genError) {
            console.error('❌ Exception during thumbnail generation:', genError);
          }
        } else if (file.type.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
          thumbnail = await generateVideoThumbnail(file);
        } else if (extension === 'pdf' || file.type === 'application/pdf') {
          thumbnail = await generatePDFThumbnail(file);
        } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
          thumbnail = await generateDocThumbnail(extension);
        } else if (file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
          thumbnail = await generateAudioThumbnail();
        }

        console.log('💾 Saving file data...');
        const arrayBuffer = await file.arrayBuffer();
        await fileDB.current.saveFileData(fileId, arrayBuffer);

        if (thumbnail && thumbnail.startsWith('data:image')) {
          try {
            await fileDB.current.saveThumbnail(fileId, thumbnail);
          } catch (thumbError) {
            console.error('❌ Failed to save thumbnail:', thumbError);
          }
        }

        const fileMetadata = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          extension: extension,
          folderId: currentFolderId,
          uploadedAt: new Date().toISOString(),
          hasThumbnail: !!(thumbnail && thumbnail.startsWith('data:image')),
          order: files.length
        };

        await fileDB.current.saveFile(fileMetadata);

        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], loaded: file.size }
        }));

      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    await loadFolderContents();
    await loadStorageUsage();

    setTimeout(() => {
      setUploadProgress({});
    }, 2000);

    e.target.value = '';
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
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openFilePreview = async (file) => {
    try {
      const fileData = await fileDB.current.getFileData(file.id);

      if (!fileData) {
        throw new Error('File data not found');
      }

      const blob = new Blob([fileData], { type: file.type });
      const url = URL.createObjectURL(blob);

      setPreviewFile({
        ...file,
        url,
        blob
      });
      setShowPreview(true);

    } catch (error) {
      console.error('Error previewing file:', error);
      alert(`Failed to preview file: ${error.message}`);
    }
  };

  const deleteFolder = async (folderId) => {
    if (!confirm('Delete folder and all its contents?')) return;

    try {
      await fileDB.current.deleteFolder(folderId);
      await loadFolderContents();
      await loadStorageUsage();
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder');
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm('Delete file?')) return;

    try {
      await fileDB.current.deleteFile(fileId);
      await loadFolderContents();
      await loadStorageUsage();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const navigateToFolder = (folderId) => {
    setCurrentFolderId(folderId);
    setIsSearching(false);
    handleClearSelection();
    cancelEdit();
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
    handleClearSelection();
    cancelEdit();
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

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0 && selectedFolders.size === 0) {
      alert('Please select files or folders to delete');
      return;
    }

    const totalItems = selectedFiles.size + selectedFolders.size;
    if (!confirm(`Delete ${totalItems} selected item${totalItems > 1 ? 's' : ''}?`)) return;

    try {
      setLoading(true);

      const fileDeletions = Array.from(selectedFiles).map(fileId =>
        fileDB.current.deleteFile(fileId)
      );

      const folderDeletions = Array.from(selectedFolders).map(folderId =>
        fileDB.current.deleteFolder(folderId)
      );

      await Promise.all([...fileDeletions, ...folderDeletions]);

      handleClearSelection();
      await loadFolderContents();
      await loadStorageUsage();

      alert(`Successfully deleted ${totalItems} item${totalItems > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Failed to delete selected items');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedFiles.size === 0) {
      alert('Please select files to download');
      return;
    }

    try {
      for (const fileId of selectedFiles) {
        const file = await fileDB.current.getFile(fileId);
        if (file) {
          await downloadFile(file);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      alert(`Downloaded ${selectedFiles.size} file${selectedFiles.size > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error in bulk download:', error);
      alert('Failed to download files');
    }
  };

  useEffect(() => {
    const updateBreadcrumb = async () => {
      if (!isAuthenticated || !dbInitialized) return;

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
  }, [currentFolderId, isAuthenticated, dbInitialized]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && fileFilter === 'all') {
      setIsSearching(false);
      await loadFolderContents();
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const includeFolders = fileFilter === 'folders' || fileFilter === 'all';

      const results = await fileDB.current.searchFiles(searchQuery, fileFilter, includeFolders);

      const foundFolders = results.filter(item => item.isFolder);
      const foundFiles = results.filter(item => !item.isFolder);

      let sortedFolders = [...foundFolders];
      if (sortBy !== 'order') {
        sortedFolders.sort((a, b) => {
          let aVal = a[sortBy === 'name' ? 'name' : 'createdAt'];
          let bVal = b[sortBy === 'name' ? 'name' : 'createdAt'];

          if (sortBy === 'name') {
            aVal = aVal?.toLowerCase() || '';
            bVal = bVal?.toLowerCase() || '';
          } else {
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

      let sortedFiles = [...foundFiles];
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

      setFolders(sortedFolders);
      setFiles(sortedFiles);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
    setFileFilter('all');
    setIsSearching(false);
    await loadFolderContents();
  };

  const startEditFolder = (folderId, currentName) => {
    setEditingFolderId(folderId);
    setEditingFileId(null);
    setEditName(currentName);

    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 10);
  };

  const startEditFile = (fileId, currentName) => {
    setEditingFileId(fileId);
    setEditingFolderId(null);
    setEditName(currentName);

    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 10);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      alert('Name cannot be empty');
      return;
    }

    try {
      if (editingFolderId) {
        await fileDB.current.updateFolder(editingFolderId, { name: editName.trim() });
      } else if (editingFileId) {
        const file = await fileDB.current.getFile(editingFileId);
        const newName = editName.trim();
        let finalName = newName;
        if (file.extension && !newName.toLowerCase().endsWith(`.${file.extension.toLowerCase()}`)) {
          finalName = `${newName}.${file.extension}`;
        }
        await fileDB.current.updateFile(editingFileId, { name: finalName });
      }

      await loadFolderContents();
      cancelEdit();
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name');
    }
  };

  const cancelEdit = () => {
    setEditingFolderId(null);
    setEditingFileId(null);
    setEditName('');
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleDragStart = (e, itemId, itemType) => {
    e.dataTransfer.setData('text/plain', `${itemType}:${itemId}`);
    setDraggingItem(itemId);
    setDraggingItemType(itemType);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggingItem(null);
    setDraggingItemType(null);
    setDragOverFolderId(null);
    setDragOverFileId(null);
  };

  const handleDragOver = (e, targetId, targetType) => {
    e.preventDefault();
    if (targetType === 'folder') {
      setDragOverFolderId(targetId);
    } else if (targetType === 'file') {
      setDragOverFileId(targetId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverFolderId(null);
    setDragOverFileId(null);
  };

  const handleDrop = async (e, targetId, targetType) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const [draggedType, draggedId] = data.split(':');

    if (draggedType === 'folder' && targetType === 'folder' && draggedId !== targetId) {
      await reorderFolders(draggedId, targetId);
    } else if (draggedType === 'file' && targetType === 'file' && draggedId !== targetId) {
      await reorderFiles(draggedId, targetId);
    } else if (draggedType === 'file' && targetType === 'folder') {
      await moveFileToFolder(draggedId, targetId);
    }

    setDragOverFolderId(null);
    setDragOverFileId(null);
  };

  const reorderFolders = async (draggedFolderId, targetFolderId) => {
    try {
      const draggedIndex = folders.findIndex(f => f.id === draggedFolderId);
      const targetIndex = folders.findIndex(f => f.id === targetFolderId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const newFolders = [...folders];
      const [draggedFolder] = newFolders.splice(draggedIndex, 1);
      newFolders.splice(targetIndex, 0, draggedFolder);

      for (let i = 0; i < newFolders.length; i++) {
        await fileDB.current.updateFolder(newFolders[i].id, { order: i });
      }

      await loadFolderContents();
    } catch (error) {
      console.error('Error reordering folders:', error);
    }
  };

  const reorderFiles = async (draggedFileId, targetFileId) => {
    try {
      const draggedIndex = files.findIndex(f => f.id === draggedFileId);
      const targetIndex = files.findIndex(f => f.id === targetFileId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const newFiles = [...files];
      const [draggedFile] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(targetIndex, 0, draggedFile);

      for (let i = 0; i < newFiles.length; i++) {
        await fileDB.current.updateFile(newFiles[i].id, { order: i });
      }

      await loadFolderContents();
    } catch (error) {
      console.error('Error reordering files:', error);
    }
  };

  const moveFileToFolder = async (fileId, folderId) => {
    try {
      await fileDB.current.updateFile(fileId, {
        folderId,
        order: 0
      });

      if (folderId === currentFolderId) {
        await loadFolderContents();
      } else {
        const folder = await fileDB.current.getFolder(folderId);
        alert(`File moved to "${folder?.name}" folder. Navigate to that folder to see it.`);
        await loadFolderContents();
      }
    } catch (error) {
      console.error('Error moving file:', error);
      alert('Failed to move file');
    }
  };

  const FilePreviewModal = () => {
    if (!showPreview || !previewFile) return null;

    const ext = previewFile.extension?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
    const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);
    const isAudio = ['mp3', 'wav', 'ogg', 'flac'].includes(ext);
    const isPDF = ext === 'pdf';

    const handleClose = () => {
      if (previewFile.url) {
        URL.revokeObjectURL(previewFile.url);
      }
      setShowPreview(false);
      setPreviewFile(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={handleClose}>
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="min-w-0">
              <h3 className="font-semibold text-lg truncate">{previewFile.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {fileDB.current.formatFileSize(previewFile.size)} • {ext.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  downloadFile(previewFile);
                  handleClose();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
            {isImage && (
              <div className="flex items-center justify-center">
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
            )}
            {isVideo && (
              <div className="flex items-center justify-center">
                <video controls className="max-w-full h-auto max-h-[70vh]">
                  <source src={previewFile.url} type={previewFile.type} />
                </video>
              </div>
            )}
            {isAudio && (
              <div className="flex items-center justify-center p-8">
                <audio controls className="w-full max-w-md">
                  <source src={previewFile.url} type={previewFile.type} />
                </audio>
              </div>
            )}
            {isPDF && (
              <iframe src={previewFile.url} className="w-full h-[70vh]" title={previewFile.name} />
            )}
            {!isImage && !isVideo && !isAudio && !isPDF && (
              <div className="text-center py-16">
                <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                <button
                  onClick={() => {
                    downloadFile(previewFile);
                    handleClose();
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Download File ({fileDB.current.formatFileSize(previewFile.size)})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isAuthenticated && !dbInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Initializing File Manager...</h2>
          <p className="text-gray-500 mt-2">Setting up storage database</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <Lock className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Advanced File Manager</h1>
          <p className="text-center text-gray-600 mb-6">Enter password to access your files</p>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (admin123)"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalSelected = selectedFiles.size + selectedFolders.size;
  const allSelected = files.length > 0 && folders.length > 0 &&
                     selectedFiles.size === files.length &&
                     selectedFolders.size === folders.length;

  const dragOverStyle = "ring-2 ring-blue-500 ring-offset-2";
  const draggingStyle = "opacity-50";

  return (
    <div className="min-h-screen bg-gray-50">
      <FilePreviewModal />

      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Advanced File Manager</h1>
                <p className="text-sm text-gray-600">IndexedDB • Unlimited Storage</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Display Settings</h3>
              <div className="flex gap-4 mb-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    checked={displayStyle === 'modern'}
                    onChange={() => setDisplayStyle('modern')}
                    className="cursor-pointer"
                  />
                  <span>Modern</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    checked={displayStyle === 'minimal'}
                    onChange={() => setDisplayStyle('minimal')}
                    className="cursor-pointer"
                  />
                  <span>Minimal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    checked={displayStyle === 'classic'}
                    onChange={() => setDisplayStyle('classic')}
                    className="cursor-pointer"
                  />
                  <span>Classic</span>
                </label>
              </div>

              {storageUsage && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Storage Usage</h3>
                    <span className="text-sm text-gray-600">
                      {storageUsage.usedFormatted} / {storageUsage.maxFormatted}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        storageUsage.percentage > 90 ? 'bg-red-500' :
                        storageUsage.percentage > 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {storageUsage.percentage > 90 && '⚠️ Storage almost full! '}
                    {Math.round(storageUsage.percentage)}% used
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
          <button
            onClick={() => navigateToFolder('root')}
            className="text-purple-600 hover:underline font-medium flex items-center gap-1"
          >
            <HardDrive className="w-4 h-4" />
            Home
          </button>
          {breadcrumb.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => navigateToFolder(folder.id)}
                className="text-purple-600 hover:underline font-medium"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
          {isSearching && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-medium">Search Results</span>
            </>
          )}
        </div>

        {(selectionMode || totalSelected > 0) && (
          <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="p-1 hover:bg-purple-100 rounded"
                    title={allSelected ? "Deselect all" : "Select all"}
                  >
                    {allSelected ? (
                      <CheckSquare className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Square className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                  <span className="font-medium text-purple-700">
                    {totalSelected} item{totalSelected !== 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedFiles.size > 0 && (
                  <button
                    onClick={handleBulkDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download ({selectedFiles.size})
                  </button>
                )}
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({totalSelected})
                </button>
                <button
                  onClick={handleClearSelection}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Files &amp; Folders
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search files and folders by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={fileFilter}
                  onChange={(e) => setFileFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Items</option>
                  <option value="folders">Folders Only</option>
                  <option value="image/">Images</option>
                  <option value="video/">Videos</option>
                  <option value="audio/">Audio</option>
                  <option value="application/pdf">PDFs</option>
                  <option value="text/">Text Files</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="order">Sort by Position</option>
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                  <option value="uploadedAt">Sort by Date</option>
                  <option value="type">Sort by Type</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Search
                </button>
                {isSearching && (
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-medium mb-2">Upload Progress</h4>
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="mb-2 last:mb-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate">{progress.name}</span>
                    <span>{Math.round((progress.loaded / progress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.loaded / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                selectionMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {selectionMode ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  Selection Mode
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  Select Items
                </>
              )}
            </button>
            {currentFolderId !== 'root' && !isSearching && (
              <button
                onClick={navigateBack}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            {!isSearching && (
              <>
                <button
                  onClick={createFolder}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <FolderPlus className="w-4 h-4" />
                  New Folder
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading files...</p>
          </div>
        ) : folders.length === 0 && files.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {isSearching ? 'No items found' : 'This folder is empty'}
            </h3>
            <p className="text-gray-500 mb-6">
              {isSearching ? 'Try a different search term' : 'Create a new folder or upload files to get started'}
            </p>
            {!isSearching && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={createFolder}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Create Folder
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Upload Files
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Folders ({folders.length})
                  {isSearching && fileFilter === 'folders' && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (Search results)
                    </span>
                  )}
                </h2>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
                  {folders.map((folder) => (
                    <div key={folder.id} className="relative group">
                      {viewMode === 'grid' ? (
                        <div className="relative">
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, folder.id, 'folder')}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, folder.id, 'folder')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, folder.id, 'folder')}
                            className={`rounded-xl p-6 cursor-pointer hover:scale-105 transition transform shadow-lg min-h-[120px] flex flex-col justify-between ${
                              dragOverFolderId === folder.id ? dragOverStyle : ''
                            } ${draggingItem === folder.id ? draggingStyle : ''} ${
                              selectedFolders.has(folder.id) ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                            }`}
                            style={{
                              backgroundColor: folder.color || FOLDER_COLORS[0],
                              color: FOLDER_TEXT_COLORS[folder.color] || '#333333'
                            }}
                            onClick={() => selectionMode ? handleFolderSelect(folder.id) : navigateToFolder(folder.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Folder className="w-10 h-10" style={{ opacity: 0.9 }} />
                              {!selectionMode && (
                                <GripVertical className="w-5 h-5 opacity-60 cursor-move" />
                              )}
                            </div>
                            <div>
                              {editingFolderId === folder.id ? (
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={handleEditKeyPress}
                                  onBlur={saveEdit}
                                  className="w-full px-2 py-1 text-sm bg-white bg-opacity-90 rounded border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ color: '#333333' }}
                                />
                              ) : (
                                <h3 className="font-semibold text-sm truncate">{folder.name}</h3>
                              )}
                              <p className="text-xs opacity-90 mt-1">
                                Created: {new Date(folder.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition z-10">
                            {!selectionMode && (
                              <FolderColorPicker
                                folderId={folder.id}
                                currentColor={folder.color || FOLDER_COLORS[0]}
                                onColorChange={changeFolderColor}
                              />
                            )}
                            {selectionMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFolderSelect(folder.id);
                                }}
                                className={`p-1 rounded-full transition ${
                                  selectedFolders.has(folder.id)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white bg-opacity-80 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                {selectedFolders.has(folder.id) ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            {!selectionMode && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditFolder(folder.id, folder.name);
                                  }}
                                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                  title="Edit folder name"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFolder(folder.id);
                                  }}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                  title="Delete folder"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, folder.id, 'folder')}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, folder.id, 'folder')}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, folder.id, 'folder')}
                          className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer border ${
                            dragOverFolderId === folder.id ? dragOverStyle : ''
                          } ${draggingItem === folder.id ? draggingStyle : ''} ${
                            selectedFolders.has(folder.id) ? 'bg-purple-50 border-purple-300' : 'bg-white'
                          }`}
                          onClick={() => selectionMode ? handleFolderSelect(folder.id) : navigateToFolder(folder.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {selectionMode ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFolderSelect(folder.id);
                                  }}
                                  className={`p-1 rounded ${
                                    selectedFolders.has(folder.id)
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {selectedFolders.has(folder.id) ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              ) : (
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                              )}
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: folder.color || FOLDER_COLORS[0] }}
                              >
                                <Folder className="w-5 h-5"
                                  style={{ color: FOLDER_TEXT_COLORS[folder.color] || '#333333' }}
                                />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              {editingFolderId === folder.id ? (
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={handleEditKeyPress}
                                  onBlur={saveEdit}
                                  className="w-full px-2 py-1 text-sm bg-white rounded border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <h3 className="font-semibold truncate">{folder.name}</h3>
                              )}
                              <p className="text-sm text-gray-500">
                                Created: {new Date(folder.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {!selectionMode && (
                            <div className="flex gap-2">
                              <FolderColorPicker
                                folderId={folder.id}
                                currentColor={folder.color || FOLDER_COLORS[0]}
                                onColorChange={changeFolderColor}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditFolder(folder.id, folder.name);
                                }}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                title="Edit folder name"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFolder(folder.id);
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                title="Delete folder"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Files ({files.length})
                </h2>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-2'}>
                  {files.map((file) => (
                    <div key={file.id} className="relative group">
                      {viewMode === 'grid' ? (
                        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, file.id, 'file')}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, file.id, 'file')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, file.id, 'file')}
                            className={`flex justify-center items-center mb-2 h-32 bg-gray-50 rounded overflow-hidden relative ${
                              dragOverFileId === file.id ? dragOverStyle : ''
                            } ${draggingItem === file.id ? draggingStyle : ''} ${
                              selectedFiles.has(file.id) ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                            }`}
                            onClick={() => selectionMode ? handleFileSelect(file.id) : openFilePreview(file)}
                          >
                            <Thumbnail file={file} fileDB={fileDB.current} className="w-full h-full" />
                            {!selectionMode && (
                              <GripVertical className="absolute top-2 right-2 w-5 h-5 text-gray-600 bg-white bg-opacity-70 rounded p-1 cursor-move" />
                            )}
                          </div>
                          <div className="mt-2 flex-1">
                            {editingFileId === file.id ? (
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleEditKeyPress}
                                onBlur={saveEdit}
                                className="w-full px-2 py-1 text-sm bg-white rounded border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-1"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <h3 className="font-semibold text-sm truncate mb-1" title={file.name}>
                                {file.name}
                              </h3>
                            )}
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{fileDB.current.formatFileSize(file.size)}</span>
                              <span>{file.extension?.toUpperCase() || 'FILE'}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            {selectionMode ? (
                              <>
                                <button
                                  onClick={() => handleFileSelect(file.id)}
                                  className={`flex-1 px-2 py-1 text-xs rounded transition ${
                                    selectedFiles.has(file.id)
                                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {selectedFiles.has(file.id) ? 'Selected' : 'Select'}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => openFilePreview(file)}
                                  className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                                >
                                  Preview
                                </button>
                                <button
                                  onClick={() => downloadFile(file)}
                                  className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                                >
                                  Download
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteFile(file.id);
                                    }}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                                    title="Delete file"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditFile(file.id, file.name.replace(`.${file.extension}`, ''));
                                    }}
                                    className="absolute -top-8 right-0 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
                                    title="Edit file name"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, file.id, 'file')}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, file.id, 'file')}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, file.id, 'file')}
                          className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border cursor-pointer ${
                            dragOverFileId === file.id ? dragOverStyle : ''
                          } ${draggingItem === file.id ? draggingStyle : ''} ${
                            selectedFiles.has(file.id) ? 'bg-purple-50 border-purple-300' : 'bg-white'
                          }`}
                          onClick={() => selectionMode ? handleFileSelect(file.id) : openFilePreview(file)}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {selectionMode ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileSelect(file.id);
                                  }}
                                  className={`p-1 rounded ${
                                    selectedFiles.has(file.id)
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {selectedFiles.has(file.id) ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                              ) : (
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                              )}
                              <Thumbnail file={file} fileDB={fileDB.current} className="w-10 h-10" />
                            </div>
                            <div className="min-w-0 flex-1">
                              {editingFileId === file.id ? (
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={handleEditKeyPress}
                                  onBlur={saveEdit}
                                  className="w-full px-2 py-1 text-sm bg-white rounded border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <h3 className="font-medium truncate">{file.name}</h3>
                              )}
                              <p className="text-sm text-gray-500">
                                {fileDB.current.formatFileSize(file.size)} • {file.extension?.toUpperCase() || 'FILE'} •
                                Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
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
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                  title="Preview file"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(file);
                                  }}
                                  className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                                  title="Download file"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditFile(file.id, file.name.replace(`.${file.extension}`, ''));
                                  }}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                  title="Edit file name"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFile(file.id);
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                  title="Delete file"
                                >
                                  <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
}