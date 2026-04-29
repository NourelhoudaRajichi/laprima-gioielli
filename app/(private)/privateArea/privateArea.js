"use client";
import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Folder, File, Grid, List, Download, ArrowLeft,
  Image, FileText, Music, Video, Archive, Search,
  Eye, X, ChevronRight, Mail, ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import "./private.css";

const VIRTUAL_FOLDERS = [
  { id: "images",    name: "Images",    icon: Image,    color: "#f8e3e8", textColor: "#004065" },
  { id: "videos",    name: "Videos",    icon: Video,    color: "#f8e3e8", textColor: "#004065" },
  { id: "documents", name: "Documents", icon: FileText, color: "#f8e3e8", textColor: "#004065" },
  { id: "audio",     name: "Audio",     icon: Music,    color: "#f8e3e8", textColor: "#004065" },
];

const FOLDER_BG   = "#f8e3e8";
const FOLDER_TEXT_COLOR = "#004065";

function getMimeFolder(mime = "") {
  if (mime.startsWith("image/"))  return "images";
  if (mime.startsWith("video/"))  return "videos";
  if (mime.startsWith("audio/"))  return "audio";
  return "documents";
}

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"]);
const VIDEO_EXTS = new Set(["mp4", "m4v", "mov", "avi", "webm", "mkv"]);

// Normalize a WP File Download file
function toWpuFile(f, folderId) {
  const ext  = (f.name || f.url || "").split(".").pop().split("?")[0].toLowerCase();
  const mime = f.mime || (IMAGE_EXTS.has(ext) ? "image/" + ext : VIDEO_EXTS.has(ext) ? "video/" + ext : ext === "pdf" ? "application/pdf" : "application/octet-stream");
  return {
    id:     folderId + "/" + f.name,
    name:   f.name,
    mime,
    ext,
    size:   f.size || 0,
    url:    f.url  || "",
    thumb:  f.thumb || (IMAGE_EXTS.has(ext) || mime.startsWith("image/") ? f.url : ""),
    date:   f.date || "",
    folder: folderId,
  };
}

function formatSize(bytes) {
  if (!bytes) return "";
  const k = 1024, sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
}

// Transform WP media item to a flat file object
function toFile(m) {
  const ext = (m.source_url || "").split(".").pop().toLowerCase();
  return {
    id:        m.id,
    name:      m.title?.rendered || m.slug || `file-${m.id}`,
    mime:      m.mime_type || "",
    ext,
    size:      m.media_details?.filesize || 0,
    url:       m.source_url || "",
    thumb:
      m.media_details?.sizes?.thumbnail?.source_url ||
      m.media_details?.sizes?.medium?.source_url ||
      (m.mime_type?.startsWith("image/") ? m.source_url : ""),
    date:      m.date || "",
    folder:    getMimeFolder(m.mime_type),
  };
}

// ── File icon fallback ────────────────────────────────────────────────────────
function FileIcon({ file, size = 10 }) {
  const cls = `w-${size} h-${size}`;
  if (file.mime.startsWith("image/"))  return <Image    className={`${cls} text-purple-500`} />;
  if (file.mime.startsWith("video/"))  return <Video    className={`${cls} text-red-600`} />;
  if (file.mime.startsWith("audio/"))  return <Music    className={`${cls} text-green-500`} />;
  if (file.mime === "application/pdf") return <FileText className={`${cls} text-red-500`} />;
  if (file.ext?.match(/zip|rar|7z|tar|gz/)) return <Archive className={`${cls} text-yellow-600`} />;
  return <File className={`${cls} text-gray-400`} />;
}

// ── Thumbnail ─────────────────────────────────────────────────────────────────
function FileThumbnail({ file, className = "" }) {
  const isImage = file.mime.startsWith("image/") || IMAGE_EXTS.has(file.ext);
  const isVideo = file.mime.startsWith("video/") || VIDEO_EXTS.has(file.ext);
  const isPDF   = file.mime === "application/pdf" || file.ext === "pdf";

  if (isImage && file.url) {
    return (
      <img
        src={file.url}
        alt={file.name}
        className={`object-cover w-full h-full ${className}`}
        onError={(e) => { e.target.replaceWith(Object.assign(document.createElement("div"), { className: "flex items-center justify-center w-full h-full" })); }}
        loading="lazy"
      />
    );
  }

  if (isVideo && file.url) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-black/5 ${className}`}>
        <video
          src={file.url}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedMetadata={(e) => { try { e.target.currentTime = 2; } catch {} }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-2">
            <Video className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  }

  if (isPDF && file.url) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <iframe
          src={`${file.url}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
          className="absolute top-0 left-0 border-0 pointer-events-none"
          style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left" }}
          title={file.name}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FileIcon file={file} size={10} />
    </div>
  );
}

// ── Auth wrapper ──────────────────────────────────────────────────────────────
export default function PrivateAreaPage() {
  const [auth, setAuth] = useState(null); // null=loading, false=no auth, object=user
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("pa_token") ||
      sessionStorage.getItem("pa_token");

    const stored =
      localStorage.getItem("pa_user") ||
      sessionStorage.getItem("pa_user");

    if (!token) {
      router.push("/privateAreaLogin");
      return;
    }

    try {
      setAuth({ token, user: JSON.parse(stored || "{}") });
    } catch {
      router.push("/privateAreaLogin");
    }
  }, [router]);

  const handleLogout = () => {
    ["pa_token", "pa_user"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    router.push("/privateAreaLogin");
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#004065] mb-4" />
          <p className="text-[#004065]">Checking access…</p>
        </div>
      </div>
    );
  }

  return (
    <PrivateAreaContent
      token={auth.token}
      user={auth.user}
      onLogout={handleLogout}
      onGoBack={() => router.push("/")}
    />
  );
}

// ── Main content ──────────────────────────────────────────────────────────────
function PrivateAreaContent({ token, user, onLogout, onGoBack }) {
  const [allFiles, setAllFiles]       = useState([]);
  const [wpFolders, setWpFolders]     = useState(null); // null = MIME mode; array = WPU mode
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [fetchError, setFetchError]   = useState("");

  const [folderPath, setFolderPath] = useState([]); // stack of folder IDs
  const currentFolder = folderPath.length > 0 ? folderPath[folderPath.length - 1] : "root";
  const [viewMode, setViewMode]       = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFiles, setPreviewFiles] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [zipping, setZipping] = useState(false);
  const preview = previewIndex >= 0 ? previewFiles[previewIndex] : null;

  const openPreview = (file, fileList) => {
    const idx = fileList.findIndex((f) => f.id === file.id);
    setPreviewFiles(fileList);
    setPreviewIndex(idx >= 0 ? idx : 0);
  };
  const closePreview = () => setPreviewIndex(-1);

  // ── Fetch files on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoadingFiles(true);
      try {
        const res = await fetch("/api/wp/private-files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load files");
        const data = await res.json();

        if (data.folders !== null && Array.isArray(data.folders)) {
          // WP File Upload plugin — real folder structure
          const normalized = data.folders.map((folder) => ({
            id:        folder.id,
            name:      folder.name,
            parent:    String(folder.parent ?? "0"),
            color:     FOLDER_BG,
            textColor: FOLDER_TEXT_COLOR,
            files:     (folder.files || []).map((f) => toWpuFile(f, folder.id)),
          }));
          setWpFolders(normalized);
          setAllFiles(normalized.flatMap((f) => f.files));

          // Auto-skip wrapper levels (plugin root, "Marketing material", etc.)
          // until we reach a level with multiple folders or files
          const idSet = new Set(normalized.map((f) => f.id));
          let path = [];
          let roots = normalized.filter((f) => !idSet.has(f.parent));
          while (roots.length === 1) {
            path.push(roots[0].id);
            const children = normalized.filter((f) => f.parent === roots[0].id);
            if (children.length !== 1) break;
            roots = children;
          }
          if (path.length > 0) setFolderPath(path);
        } else {
          // Fallback: MIME-type grouping from WP media library
          setWpFolders(null);
          setAllFiles((data.media || []).map(toFile));
        }
      } catch (e) {
        setFetchError(e.message);
      } finally {
        setLoadingFiles(false);
      }
    };
    load();
  }, [token]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const isWpuMode = wpFolders !== null;

  const folderIdSet = isWpuMode ? new Set(wpFolders.map((f) => f.id)) : new Set();

  // Show a folder if it has files OR has any subfolders (container folders always show)
  const folderHasContent = (folderId) => {
    const folder = wpFolders.find((f) => f.id === folderId);
    if (folder?.files?.length > 0) return true;
    return wpFolders.some((f) => f.parent === folderId);
  };

  const isHiddenFolder = (f) => /do not use/i.test(f.name);

const visibleFolders =
    currentFolder === "root"
      ? isWpuMode
        ? wpFolders.filter((f) => !folderIdSet.has(f.parent) && folderHasContent(f.id) && !isHiddenFolder(f))
        : VIRTUAL_FOLDERS.filter((f) => allFiles.some((file) => file.folder === f.id))
      : isWpuMode
        ? wpFolders.filter((f) => f.parent === currentFolder && folderHasContent(f.id) && !isHiddenFolder(f))
        : [];

  const currentFolderObj = isWpuMode ? wpFolders?.find((f) => f.id === currentFolder) : null;
  const currentFolderName = isWpuMode
    ? currentFolderObj?.name
    : VIRTUAL_FOLDERS.find((f) => f.id === currentFolder)?.name;

  // Breadcrumb path for WPU mode
  const breadcrumbPath = isWpuMode
    ? folderPath.map((id) => wpFolders?.find((f) => f.id === id)).filter(Boolean)
    : [];

  let visibleFiles =
    currentFolder === "root"
      ? []
      : isWpuMode
        ? (currentFolderObj?.files || [])
        : allFiles.filter((f) => f.folder === currentFolder);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    visibleFiles = allFiles.filter((f) => f.name.toLowerCase().includes(q));
  }

  visibleFiles = [...visibleFiles].sort((a, b) =>
    (a.name || "").toLowerCase() < (b.name || "").toLowerCase() ? -1 : 1
  );

  const isSearching = !!searchQuery.trim();

  // ── Download ─────────────────────────────────────────────────────────────
  const downloadFile = (file) => {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Recursively add folder contents into a JSZip folder, preserving structure ──
  const addFolderToZip = async (zipFolder, folderId) => {
    const folder = wpFolders?.find((f) => f.id === folderId);
    const files = folder?.files || [];
    const children = wpFolders?.filter((f) => f.parent === folderId) || [];

    // Add direct files
    await Promise.all(
      files.map(async (file) => {
        try {
          const proxyUrl = `/api/wp/file-proxy?url=${encodeURIComponent(file.url)}`;
          const res = await fetch(proxyUrl);
          if (!res.ok) return;
          zipFolder.file(file.name, await res.blob());
        } catch { /* skip */ }
      })
    );

    // Recurse into subfolders
    await Promise.all(
      children.map(async (child) => {
        const subZipFolder = zipFolder.folder(child.name);
        await addFolderToZip(subZipFolder, child.id);
      })
    );
  };

  // ── Download current folder as ZIP preserving directory structure ────────
  const downloadAll = async () => {
    if (zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const folderName = isWpuMode
        ? (wpFolders?.find((f) => f.id === currentFolder)?.name || "files")
        : "files";

      if (isWpuMode) {
        await addFolderToZip(zip, currentFolder);
      } else {
        await Promise.all(
          visibleFiles.map(async (file) => {
            try {
              const res = await fetch(`/api/wp/file-proxy?url=${encodeURIComponent(file.url)}`);
              if (!res.ok) return;
              zip.file(file.name, await res.blob());
            } catch { /* skip */ }
          })
        );
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${folderName}.zip`);
    } finally {
      setZipping(false);
    }
  };

  // ── Preview modal ─────────────────────────────────────────────────────────
  const PreviewModal = () => {
    useEffect(() => {
      if (!preview) return;
      const onKey = (e) => {
        if (e.key === "ArrowRight") setPreviewIndex((i) => Math.min(previewFiles.length - 1, i + 1));
        if (e.key === "ArrowLeft")  setPreviewIndex((i) => Math.max(0, i - 1));
        if (e.key === "Escape")     closePreview();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    if (!preview) return null;
    const isImg   = preview.mime.startsWith("image/")  || IMAGE_EXTS.has(preview.ext);
    const isVideo = preview.mime.startsWith("video/")  || VIDEO_EXTS.has(preview.ext);
    const isAudio = preview.mime.startsWith("audio/");
    const isPDF   = preview.mime === "application/pdf" || preview.ext === "pdf";
    const hasPrev = previewIndex > 0;
    const hasNext = previewIndex < previewFiles.length - 1;

    return (
      <div
        className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
        onClick={closePreview}
      >
        {/* Prev button */}
        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); setPreviewIndex((i) => i - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition"
          >
            <ChevronLeft className="w-6 h-6 text-[#004065]" />
          </button>
        )}

        {/* Next button */}
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); setPreviewIndex((i) => i + 1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition"
          >
            <ChevronRight className="w-6 h-6 text-[#004065]" />
          </button>
        )}

        <div
          className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg truncate text-[#004065]">{preview.name}</h3>
              <p className="text-sm text-gray-500">
                {formatSize(preview.size)} · {preview.ext?.toUpperCase()}
                {previewFiles.length > 1 && (
                  <span className="ml-3 text-[#ec9cb2]">{previewIndex + 1} / {previewFiles.length}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(preview.url, "_blank")}
                className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065]"
                title="Open in new tab"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => downloadFile(preview)}
                className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065]"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button onClick={closePreview} className="p-2 hover:bg-[#f8e3e8] rounded-lg transition text-[#004065]">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-auto max-h-[calc(90vh-80px)] flex items-center justify-center">
            {isImg && (
              <img src={preview.url} alt={preview.name} className="max-w-full max-h-[70vh] object-contain" />
            )}
            {isVideo && (
              <video key={preview.url} controls autoPlay className="max-w-full max-h-[70vh]">
                <source src={preview.url} type={preview.mime} />
              </video>
            )}
            {isAudio && (
              <div className="w-full max-w-md text-center">
                <Music className="w-16 h-16 text-[#004065] mx-auto mb-4" />
                <p className="text-[#004065] font-medium mb-4 truncate">{preview.name}</p>
                <audio key={preview.url} controls autoPlay className="w-full">
                  <source src={preview.url} type={preview.mime} />
                </audio>
              </div>
            )}
            {isPDF && (
              <iframe key={preview.url} src={preview.url} className="w-full border-0" style={{ height: "65vh" }} title={preview.name} />
            )}
            {!isImg && !isVideo && !isAudio && !isPDF && (
              <div className="text-center py-12">
                <FileIcon file={preview} size={16} />
                <p className="mt-4 text-[#004065] font-medium">Preview not available</p>
                <button
                  onClick={() => downloadFile(preview)}
                  className="mt-4 px-6 py-2 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition"
                >
                  <Download className="w-4 h-4 inline mr-2" />Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <PreviewModal />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="absolute left-1/2 -translate-x-1/2">
                <img src="/img/La-Prima-Logo.png" alt="La Prima Gioielli" className="h-8" />
              </div>
              <div className="flex-1 flex items-center justify-end gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-gray-500 text-sm">Welcome,</p>
                  <p className="text-[#004065] font-medium">{user.name || user.email}</p>
                </div>
                <div className="h-10 w-px bg-gray-300 hidden md:block" />
                <button
                  onClick={onGoBack}
                  className="px-6 py-2.5 bg-white text-[#004065] border border-[#004065] rounded-lg hover:bg-[#f8e3e8] transition font-medium hidden md:block"
                >
                  ← Website
                </button>
                <button
                  onClick={onLogout}
                  className="px-6 py-2.5 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#e68ba6] transition font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative h-[28rem] bg-cover bg-center"
          style={{ backgroundImage: "url(https://laprimagioielli.com/wp-content/uploads/2025/09/BLOOMY-WEB-scaled.jpg)" }}
        />

        <div className="bg-white py-4 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
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
                  className="text-[#004065] font-medium text-sm hover:text-[#ec9cb2] transition"
                >
                  marketing@laprimagioielli.it
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm bg-white px-4 py-3 rounded-lg shadow-sm border border-[#ec9cb2]/20">
          <button
            onClick={() => { setFolderPath([]); setSearchQuery(""); }}
            className="text-[#004065] hover:text-[#ec9cb2] font-medium transition"
          >
            Home
          </button>
          {breadcrumbPath.map((f, i) => (
            <React.Fragment key={f.id}>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {i < breadcrumbPath.length - 1 ? (
                <button
                  onClick={() => setFolderPath(folderPath.slice(0, i + 1))}
                  className="text-[#004065] hover:text-[#ec9cb2] transition"
                >
                  {f.name}
                </button>
              ) : (
                <span className="text-[#004065] font-medium">{f.name}</span>
              )}
            </React.Fragment>
          ))}
          {!isWpuMode && currentFolder !== "root" && !isSearching && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-[#004065] font-medium">{currentFolderName}</span>
            </>
          )}
          {isSearching && (
            <>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Search Results</span>
            </>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {currentFolder !== "root" && !isSearching && (
              <button
                onClick={() => setFolderPath((p) => p.slice(0, -1))}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#004065] border border-[#ec9cb2] rounded-lg hover:bg-[#f8e3e8] transition font-medium shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files…"
                className="pl-10 pr-4 py-2.5 border border-[#ec9cb2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004065]/20 bg-white shadow-sm w-56"
              />
            </div>
            {isSearching && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2.5 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#e68ba6] transition font-medium"
              >
                Clear
              </button>
            )}

            {/* View mode */}
            <div className="flex items-center gap-1">
              {[
                { mode: "grid", Icon: Grid },
                { mode: "list", Icon: List },
              ].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2.5 rounded-lg transition shadow-sm ${
                    viewMode === mode
                      ? "bg-[#004065] text-white"
                      : "hover:bg-[#f8e3e8] border border-[#ec9cb2] bg-white text-[#004065]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loadingFiles ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#ec9cb2]/20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#004065]" />
            <p className="mt-4 text-[#004065]">Loading files…</p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-red-200">
            <p className="text-red-600 font-medium">{fetchError}</p>
            <button
              onClick={onLogout}
              className="mt-4 px-6 py-2 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            {/* Folders (root view only) */}
            {visibleFolders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 text-[#004065]">Folders ({visibleFolders.length})</h2>
                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "space-y-3"}>
                  {visibleFolders.map((folder, idx) => {
                    const Icon = folder.icon || Folder;
                    const bgColor   = folder.color || FOLDER_BG;
                    const textColor = folder.textColor || FOLDER_TEXT_COLOR;
                    const subCount  = isWpuMode ? wpFolders.filter((f) => f.parent === folder.id).length : 0;
                    const fileCount = isWpuMode ? folder.files.length : allFiles.filter((f) => f.folder === folder.id).length;
                    const countLabel = isWpuMode
                      ? [fileCount && `${fileCount} file${fileCount !== 1 ? "s" : ""}`, subCount && `${subCount} folder${subCount !== 1 ? "s" : ""}`].filter(Boolean).join(", ") || "empty"
                      : `${fileCount} file${fileCount !== 1 ? "s" : ""}`;
                    const navigateInto = () => { setFolderPath((p) => [...p, folder.id]); setSearchQuery(""); };
                    return viewMode === "grid" ? (
                      <div
                        key={folder.id}
                        className="rounded-xl p-6 cursor-pointer hover:scale-105 transition-all shadow-lg min-h-[120px] flex flex-col justify-between border-2 border-transparent"
                        style={{ backgroundColor: bgColor, color: textColor }}
                        onClick={navigateInto}
                      >
                        <Icon className="w-10 h-10 opacity-90" />
                        <div>
                          <h3 className="font-semibold text-sm">{folder.name}</h3>
                          <p className="text-xs opacity-75 mt-1">{countLabel}</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={folder.id}
                        className="flex items-center justify-between p-5 rounded-xl bg-white border border-[#ec9cb2]/30 hover:border-[#ec9cb2] cursor-pointer transition shadow-sm"
                        onClick={navigateInto}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                            <Icon className="w-6 h-6" style={{ color: textColor }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#004065]">{folder.name}</h3>
                            <p className="text-sm text-gray-500">{countLabel}</p>
                          </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-[#ec9cb2] rotate-180" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Files */}
            {visibleFiles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#004065]">
                    {isSearching ? `Search results (${visibleFiles.length})` : `Files (${visibleFiles.length})`}
                  </h2>
                  {!isSearching && (
                    <button
                      onClick={downloadAll}
                      disabled={zipping}
                      className="flex items-center gap-2 px-4 py-2 bg-[#004065] text-white text-sm rounded-lg hover:bg-[#003154] transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      {zipping ? "Preparing ZIP…" : "Download All"}
                    </button>
                  )}
                </div>
                <div className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-3"
                }>
                  {visibleFiles.map((file) =>
                    viewMode === "grid" ? (
                      <div
                        key={file.id}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-[#ec9cb2]/20 hover:border-[#ec9cb2] flex flex-col cursor-pointer"
                        onClick={() => openPreview(file, visibleFiles)}
                      >
                        <div className="h-32 bg-gradient-to-br from-[#f8e3e8] to-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                          <FileThumbnail file={file} />
                        </div>
                        <h3 className="font-medium text-sm truncate text-[#004065] mb-1" title={file.name}>
                          {file.name}
                        </h3>
                        <div className="flex justify-between text-xs mb-3">
                          <span className="text-gray-500">{formatSize(file.size)}</span>
                          <span className="text-[#004065] font-medium">{file.ext?.toUpperCase()}</span>
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); openPreview(file, visibleFiles); }}
                            className="flex-1 px-3 py-2 bg-[#004065] text-white text-xs rounded-lg hover:bg-[#003154] transition font-medium"
                          >
                            Preview
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
                            className="flex-1 px-3 py-2 bg-[#ec9cb2] text-white text-xs rounded-lg hover:bg-[#e68ba6] transition font-medium"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-5 rounded-xl bg-white border border-[#ec9cb2]/30 hover:border-[#ec9cb2] cursor-pointer transition shadow-sm"
                        onClick={() => openPreview(file, visibleFiles)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#f8e3e8] to-gray-50 flex items-center justify-center">
                            <FileThumbnail file={file} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-[#004065] truncate">{file.name}</h3>
                            <p className="text-sm text-gray-500">
                              {formatSize(file.size)} · <span className="text-[#004065] font-medium">{file.ext?.toUpperCase()}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 ml-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); openPreview(file, visibleFiles); }}
                            className="p-2.5 text-[#004065] hover:bg-[#004065]/10 rounded-lg transition"
                            title="Preview"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
                            className="p-2.5 bg-[#ec9cb2] text-white hover:bg-[#e68ba6] rounded-lg transition shadow-sm"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {visibleFolders.length === 0 && visibleFiles.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#ec9cb2]/20">
                <Folder className="w-16 h-16 text-[#ec9cb2] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#004065] mb-2">
                  {isSearching ? "No files found" : "No files available"}
                </h3>
                {isSearching && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-[#004065] text-white rounded-lg hover:bg-[#003154] transition"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
