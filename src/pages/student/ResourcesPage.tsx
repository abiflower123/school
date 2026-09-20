import { useEffect, useState, useMemo } from "react";
import {
  Folder, FileText, File, PresentationIcon, Download, Search,
  ChevronRight, X, Clock, Box, PlayCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getResources, type Resource, type ResourceFolder } from "../../services/mock/resources";

export default function ResourcesPage() {
  const { selectedChild } = useAuth();
  const sid = selectedChild?.id ?? "STU001";
  
  const [folders, setFolders] = useState<ResourceFolder[]>(() => getResources(sid));
  const [activeFolder, setActiveFolder] = useState<ResourceFolder | null>(null);
  const [selectedFile, setSelectedFile] = useState<Resource | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  
  // Update folders on student change
  useEffect(() => {
    setFolders(getResources(sid));
    setActiveFolder(null);
    setSelectedFile(null);
  }, [sid]);

  // Aggregate all resources to find "Recently Added" and unique subjects
  const allResources = useMemo(() => {
    return folders.flatMap(f => f.resources);
  }, [folders]);

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(allResources.map(r => r.subject));
    return ["All Subjects", ...Array.from(subjects)];
  }, [allResources]);

  // Sort by date added (mock string parsing, assuming format "MMM DD, YYYY" or similar)
  // For a reliable mock, we'll just reverse the array as an approximation for "Recent"
  const recentResources = useMemo(() => {
    return [...allResources].reverse().slice(0, 5); // Take top 5
  }, [allResources]);

  // Filtered resources for search state
  const filteredFolders = useMemo(() => {
    if (!searchQuery && subjectFilter === "All Subjects") return folders;
    
    return folders.map(folder => {
      // If we are searching, we should filter the files inside the folders
      const filteredFiles = folder.resources.filter(r => {
        const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = subjectFilter === "All Subjects" || r.subject === subjectFilter;
        return matchesQuery && matchesSubject;
      });
      return { ...folder, resources: filteredFiles };
    }).filter(folder => folder.resources.length > 0 || folder.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [folders, searchQuery, subjectFilter]);

  const handleDownload = (resource: Resource) => {
    const blob = new Blob(
      [`${resource.title}\nSubject: ${resource.subject}\nType: ${resource.type}\nAdded: ${resource.dateAdded}\n\nThis is a placeholder file. The school will provide the real document once file storage is connected.`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resource.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderIcon = (type: string, size = 20) => {
    switch (type) {
      case "PDF": return <FileText size={size} className="text-rose-500" />;
      case "Video": return <PlayCircle size={size} className="text-violet-500" />;
      case "Document": return <File size={size} className="text-blue-500" />;
      case "Presentation": return <PresentationIcon size={size} className="text-amber-500" />;
      default: return <File size={size} className="text-zinc-500" />;
    }
  };

  const getFolderTheme = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("paper") || n.includes("exam")) return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" };
    if (n.includes("syllabus")) return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" };
    if (n.includes("note") || n.includes("material")) return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" };
    return { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100" };
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 lg:space-y-8 relative">
      
      {/* Header & Global Search */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Digital Library</h1>
          <p className="mt-1 text-sm text-zinc-500">Access syllabus, notes, videos, and previous year papers.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full sm:w-auto h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 outline-none focus:border-zinc-400"
          >
            {uniqueSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-zinc-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {activeFolder ? (
        // --- INSIDE A FOLDER ---
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setActiveFolder(null)} className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
              Digital Library
            </button>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-sm font-bold text-zinc-900">{activeFolder.name}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeFolder.resources.map(res => (
              <button 
                key={res.id} 
                onClick={() => setSelectedFile(res)}
                className="group flex items-start gap-4 text-left rounded-xl border border-zinc-200 bg-white p-5 transition hover:shadow-md hover:border-zinc-300"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 group-hover:scale-105 transition-transform">
                  {renderIcon(res.type, 24)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{res.title}</p>
                  <p className="text-xs font-semibold text-zinc-400 mt-1">{res.subject}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                    <span>{res.size}</span>
                    <span>{res.dateAdded}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        // --- LIBRARY HOME ---
        <div className="space-y-8">
          
          {/* Recently Added Section */}
          {searchQuery === "" && subjectFilter === "All Subjects" && recentResources.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Clock size={16} /> Recently Added
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
                {recentResources.map(res => (
                  <button 
                    key={`recent-${res.id}`}
                    onClick={() => setSelectedFile(res)}
                    className="group relative flex w-64 shrink-0 flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 transition hover:shadow-md hover:border-zinc-300 text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 group-hover:bg-blue-50 transition-colors">
                        {renderIcon(res.type, 18)}
                      </div>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        {res.type}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{res.title}</p>
                      <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">{res.subject}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Folders / Search Results Grid */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Box size={16} /> {searchQuery || subjectFilter !== "All Subjects" ? "Search Results" : "All Collections"}
            </h2>
            
            {filteredFolders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 p-12 text-center bg-white">
                <Search size={32} className="mx-auto text-zinc-300 mb-3" />
                <p className="text-sm font-bold text-zinc-900">No resources found</p>
                <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFolders.map(folder => {
                  const theme = getFolderTheme(folder.name);
                  return (
                    <button 
                      key={folder.id}
                      onClick={() => setActiveFolder(folder)}
                      className="group flex flex-col items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 text-left transition hover:shadow-lg hover:border-zinc-300"
                    >
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${theme.bg} ${theme.text} ${theme.border} group-hover:scale-110 transition-transform`}>
                        <Folder size={28} fill="currentColor" className="opacity-20 absolute" />
                        <Folder size={28} className="relative z-10" />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-bold text-zinc-900">{folder.name}</h3>
                           <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{folder.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                            {folder.resources.length} Items
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* FILE PREVIEW DRAWER */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             
             {/* Drawer Header */}
             <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                    {renderIcon(selectedFile.type, 20)}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <h2 className="font-bold text-zinc-900 truncate">{selectedFile.type} File</h2>
                  </div>
               </div>
               <button 
                 onClick={() => setSelectedFile(null)}
                 className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>

             {/* Drawer Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Placeholder for File Preview */}
                <div className="aspect-video w-full rounded-xl border border-zinc-200 bg-zinc-100 flex items-center justify-center overflow-hidden relative group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-50 opacity-50"></div>
                   {renderIcon(selectedFile.type, 64)}
                   <div className="absolute bottom-3 right-3 rounded-md bg-black/50 backdrop-blur px-2 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
                     Preview Unavailable
                   </div>
                </div>

                {/* File Metadata */}
                <div>
                   <h3 className="text-xl font-black text-zinc-900 leading-tight">{selectedFile.title}</h3>
                   <div className="mt-4 grid grid-cols-2 gap-4">
                     <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Subject</p>
                       <p className="text-sm font-semibold text-zinc-900">{selectedFile.subject}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">File Size</p>
                       <p className="text-sm font-semibold text-zinc-900">{selectedFile.size}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Date Added</p>
                       <p className="text-sm font-semibold text-zinc-900">{selectedFile.dateAdded}</p>
                     </div>
                   </div>
                </div>
             </div>

             {/* Drawer Footer Actions */}
             <div className="border-t border-zinc-100 p-6 bg-zinc-50/50">
               <button 
                 onClick={() => handleDownload(selectedFile)}
                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-zinc-800 shadow-lg shadow-zinc-900/20"
               >
                 <Download size={18} />
                 Download File
               </button>
               <p className="mt-3 text-center text-xs font-medium text-zinc-500">
                 Secure download via school portal.
               </p>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
