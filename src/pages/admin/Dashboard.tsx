import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, GraduationCap, DollarSign, Activity, Check, Download, Trash2, Key, UploadCloud, Link as LinkIcon, Image as ImageIcon, Video, Plus, Database } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/store'
import AdminLogin from './AdminLogin'
import { uploadFileToSupabase, supabase, saveToSupabaseTable, updateAdminPassword, deleteFromSupabaseTable, deleteFileFromSupabase } from '@/lib/supabase'

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

const handleFileUpload = async (file: File, bucket: string, path: string) => {
  if (file.size > 5242880) throw new Error('File must be less than 5MB');
  
  try {
    return await uploadFileToSupabase(file, bucket, path);
  } catch (e: any) {
    console.error('Supabase upload failed:', e);
    throw new Error(`Upload failed: ${e.message}`);
  }
}

const openBase64InNewTab = async (dataUrl: string, title: string = 'Document') => {
  if (!dataUrl) return;
  
  if (dataUrl.startsWith('data:')) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch(e) {
      console.error(e);
      const w = window.open();
      if (w) {
         w.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
         w.document.title = title;
      }
    }
  } else {
    // If it's a real HTTP/HTTPS URL, just open it
    window.open(dataUrl, '_blank');
  }
};

export default function Dashboard() {
  const { 
    isAuthenticated, students, updateStudentStatus, removeStudent,
    winnersArtwork, addWinnerArtwork, removeWinnerArtwork,
    activities, addActivity, removeActivity,
    videos, addVideo, removeVideo,
    artworkGallery, addArtworkGallery, removeArtworkGallery
  } = useAppStore();
  
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  
  const handleDeleteStudent = async (item: any) => {
    // Only proceed to delete file if the student actually exists in Supabase and can be deleted
    let dbSuccess = false;
    if (item.registrationNumber) {
      const res = await deleteFromSupabaseTable('students', 'registration_number', item.registrationNumber);
      dbSuccess = res.success;
    } else {
      // Legacy student without registration number, just remove locally
      dbSuccess = true;
    }
    
    // Check if other students share the same receipt before deleting it
    const sameReceiptCount = students.filter(s => s.paymentProofUrl === item.paymentProofUrl).length;
    
    // Remove from local store
    removeStudent(item.id);
    
    // Only delete images if the DB row was deleted (or it's legacy) to avoid orphaned rows with 404 images
    if (dbSuccess) {
      if (item.passportUrl && !item.passportUrl.includes('placeholder')) {
        await deleteFileFromSupabase('tpsc-images', item.passportUrl);
      }
      if (item.paymentProofUrl && !item.paymentProofUrl.includes('placeholder') && sameReceiptCount <= 1) {
        await deleteFileFromSupabase('tpsc-images', item.paymentProofUrl);
      }
    }
  };

  const handleDeleteWinnerArtwork = async (item: any) => {
    const res = await deleteFromSupabaseTable('winner_artwork', 'title', item.title);
    removeWinnerArtwork(item.id);
    if (res.success && item.imageUrl) await deleteFileFromSupabase('tpsc-images', item.imageUrl);
  };

  const handleDeleteActivity = async (item: any) => {
    const res = await deleteFromSupabaseTable('activities', 'title', item.title);
    removeActivity(item.id);
    if (res.success && item.imageUrl) await deleteFileFromSupabase('tpsc-images', item.imageUrl);
  };

  const handleDeleteVideo = async (item: any) => {
    await deleteFromSupabaseTable('video_gallery', 'video_url', item.videoUrl);
    removeVideo(item.id);
  };

  const handleDeleteArtworkGallery = async (item: any) => {
    const res = await deleteFromSupabaseTable('artwork_gallery', 'title', item.title);
    removeArtworkGallery(item.id);
    if (res.success && item.imageUrl) await deleteFileFromSupabase('tpsc-images', item.imageUrl);
  };
  // Winners state
  const [winnerTitle, setWinnerTitle] = useState('');
  const [winnerProjectName, setWinnerProjectName] = useState('');
  const [winnerAge, setWinnerAge] = useState('');
  const [winnerPersonName, setWinnerPersonName] = useState('');
  const [winnerCountry, setWinnerCountry] = useState('');
  const [winnerType, setWinnerType] = useState<'GRAND_PRIZES'|'SPECIAL_AWARDS'|'BEST_FINALISTS'>('GRAND_PRIZES');
  const [winnerFile, setWinnerFile] = useState<File|null>(null);
  const [winnerImageUrls, setWinnerImageUrls] = useState('');
  const [isUploadingWinner, setIsUploadingWinner] = useState(false);
  
  // Activities state
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCountry, setActivityCountry] = useState('');
  const [activityContestNumber, setActivityContestNumber] = useState('');
  const [activityFile, setActivityFile] = useState<File|null>(null);
  const [activityImageUrls, setActivityImageUrls] = useState('');
  const [isUploadingActivity, setIsUploadingActivity] = useState(false);
  
  // Video state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState<'youtube'|'drive'>('youtube');
  
  // Artwork Gallery state
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryProjectName, setGalleryProjectName] = useState('');
  const [galleryAge, setGalleryAge] = useState('');
  const [galleryPersonName, setGalleryPersonName] = useState('');
  const [galleryCountry, setGalleryCountry] = useState('');
  const [galleryFile, setGalleryFile] = useState<File|null>(null);
  const [galleryImageUrls, setGalleryImageUrls] = useState('');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [contentError, setContentError] = useState('');

  const handleAddWinner = async () => {
    setContentError('');
    if (!winnerTitle || !winnerProjectName || !winnerAge || !winnerPersonName || !winnerCountry) return setContentError('Please fill all fields.');
    if (!winnerFile && !winnerImageUrls.trim()) return setContentError('Please provide an image file or at least one image URL.');
    setIsUploadingWinner(true);
    try {
      if (winnerFile) {
        const sanitizedFileName = winnerFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const imageUrl = await handleFileUpload(winnerFile, 'tpsc-images', `winners/${fileName}`);
        
        const payload = { 
          title: winnerTitle, 
          project_name: winnerProjectName,
          age: winnerAge,
          person_name: winnerPersonName,
          country: winnerCountry,
          type: winnerType, 
          image_url: imageUrl 
        };
        
        const dbRes = await saveToSupabaseTable('winner_artwork', payload);
        if (!dbRes.success) throw new Error(dbRes.error);
  
        addWinnerArtwork({
          title: winnerTitle, 
          projectName: winnerProjectName,
          age: winnerAge,
          personName: winnerPersonName,
          country: winnerCountry,
          type: winnerType, 
          imageUrl 
        });
      }

      if (winnerImageUrls.trim()) {
        const urls = winnerImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        for (const url of urls) {
          const payload = { 
            title: winnerTitle, 
            project_name: winnerProjectName,
            age: winnerAge,
            person_name: winnerPersonName,
            country: winnerCountry,
            type: winnerType, 
            image_url: url 
          };
          const dbRes = await saveToSupabaseTable('winner_artwork', payload);
          if (!dbRes.success) throw new Error(dbRes.error);
    
          addWinnerArtwork({
            title: winnerTitle, 
            projectName: winnerProjectName,
            age: winnerAge,
            personName: winnerPersonName,
            country: winnerCountry,
            type: winnerType, 
            imageUrl: url 
          });
        }
      }
      setWinnerTitle(''); setWinnerProjectName(''); setWinnerAge(''); setWinnerPersonName(''); setWinnerCountry(''); setWinnerFile(null); setWinnerImageUrls('');
    } catch (e: any) {
      setContentError(`Error adding winner: ${e.message}`);
    } finally {
      setIsUploadingWinner(false);
    }
  };

  const handleAddActivity = async () => {
    setContentError('');
    if (!activityTitle || !activityCountry || !activityContestNumber) return setContentError('Please fill all fields.');
    if (!activityFile && !activityImageUrls.trim()) return setContentError('Please provide an image file or at least one image URL.');
    setIsUploadingActivity(true);
    try {
      if (activityFile) {
        const sanitizedFileName = activityFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const imageUrl = await handleFileUpload(activityFile, 'tpsc-images', `activities/${fileName}`);
        
        const payload = { 
          title: activityTitle, 
          country: activityCountry,
          contest_number: activityContestNumber,
          image_url: imageUrl 
        };
        const dbRes = await saveToSupabaseTable('activities', payload);
        if (!dbRes.success) throw new Error(dbRes.error);
  
        addActivity({ 
          title: activityTitle, 
          country: activityCountry,
          contestNumber: activityContestNumber,
          imageUrl 
        });
      }

      if (activityImageUrls.trim()) {
        const urls = activityImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        for (const url of urls) {
          const payload = { 
            title: activityTitle, 
            country: activityCountry,
            contest_number: activityContestNumber,
            image_url: url 
          };
          const dbRes = await saveToSupabaseTable('activities', payload);
          if (!dbRes.success) throw new Error(dbRes.error);
    
          addActivity({ 
            title: activityTitle, 
            country: activityCountry,
            contestNumber: activityContestNumber,
            imageUrl: url 
          });
        }
      }
      setActivityTitle(''); setActivityCountry(''); setActivityContestNumber(''); setActivityFile(null); setActivityImageUrls('');
    } catch (e: any) {
      setContentError(`Error adding activities: ${e.message}`);
    } finally {
      setIsUploadingActivity(false);
    }
  };

  const handleAddVideo = async () => {
    setContentError('');
    if (!videoTitle || !videoUrl) return setContentError('Please provide a title and URL.');
    
    const dbRes = await saveToSupabaseTable('video_gallery', {
      title: videoTitle,
      video_url: videoUrl,
      platform: videoType
    });
    if (!dbRes.success) return setContentError(dbRes.error);
    
    addVideo({ title: videoTitle, videoUrl, type: videoType });
    setVideoTitle(''); setVideoUrl('');
  };

  const handleAddGallery = async () => {
    setContentError('');
    if (!galleryTitle || !galleryProjectName || !galleryAge || !galleryPersonName || !galleryCountry) return setContentError('Please fill all fields.');
    if (!galleryFile && !galleryImageUrls.trim()) return setContentError('Please provide an image file or at least one image URL.');
    setIsUploadingGallery(true);
    try {
      if (galleryFile) {
        const sanitizedFileName = galleryFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const imageUrl = await handleFileUpload(galleryFile, 'tpsc-images', `gallery/${fileName}`);
        
        const payload = { 
          title: galleryTitle, 
          project_name: galleryProjectName,
          age: galleryAge,
          person_name: galleryPersonName,
          country: galleryCountry,
          image_url: imageUrl 
        };
        const dbRes = await saveToSupabaseTable('artwork_gallery', payload);
        if (!dbRes.success) throw new Error(dbRes.error);
  
        addArtworkGallery({ 
          title: galleryTitle, 
          projectName: galleryProjectName,
          age: galleryAge,
          personName: galleryPersonName,
          country: galleryCountry,
          imageUrl 
        });
      }

      if (galleryImageUrls.trim()) {
        const urls = galleryImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        for (const url of urls) {
          const payload = { 
            title: galleryTitle, 
            project_name: galleryProjectName,
            age: galleryAge,
            person_name: galleryPersonName,
            country: galleryCountry,
            image_url: url 
          };
          const dbRes = await saveToSupabaseTable('artwork_gallery', payload);
          if (!dbRes.success) throw new Error(dbRes.error);
    
          addArtworkGallery({ 
            title: galleryTitle, 
            projectName: galleryProjectName,
            age: galleryAge,
            personName: galleryPersonName,
            country: galleryCountry,
            imageUrl: url 
          });
        }
      }
      setGalleryTitle(''); setGalleryProjectName(''); setGalleryAge(''); setGalleryPersonName(''); setGalleryCountry(''); setGalleryFile(null); setGalleryImageUrls('');
    } catch(e: any) {
      setContentError(`Error adding gallery artwork: ${e.message}`);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const totalRegistered = students.length;
  const uniqueSchools = new Set(students.map(s => s.schoolName)).size;
  const verifiedCount = students.filter(s => s.status === 'Verified').length;
  const pendingCount = students.filter(s => s.status === 'Pending').length;

  const schoolsGroups = React.useMemo(() => {
    const map = new Map<string, typeof students>();
    students.forEach(s => {
      if (!map.has(s.schoolName)) {
        map.set(s.schoolName, []);
      }
      map.get(s.schoolName)!.push(s);
    });
    return Array.from(map.entries()).map(([schoolName, studentsList]) => ({
      schoolName,
      country: studentsList[0].country,
      state: studentsList[0].state,
      paymentProofUrl: studentsList[0].paymentProofUrl,
      students: studentsList,
      verifiedCount: studentsList.filter(s => s.status === 'Verified').length
    }));
  }, [students]);

  if (!isAuthenticated) return <AdminLogin />;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('adminPassword') || 'Thinkers123';
    if (stored !== oldPassword) {
      setPwdMsg('Old password incorrect!');
      return;
    }
    
    // Save to local storage 
    localStorage.setItem('adminPassword', newPassword);

    // Save to Supabase as requested
    const res = await updateAdminPassword(newPassword);
    if (!res.success && res.error !== 'missing credentials') {
       // if we have credentials but it failed, notify
       setPwdMsg('Saved locally, but Supabase update failed: ' + res.error);
    } else {
       setPwdMsg('Password updated successfully!');
    }

    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage registrations and website settings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="transition-all hover:scale-105 active:scale-95 shadow-sm" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRegistered}</div>
                <p className="text-xs text-muted-foreground">students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools Participating</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueSchools}</div>
                <p className="text-xs text-muted-foreground">institutions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Verifications</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedCount}</div>
                <p className="text-xs text-muted-foreground">approved students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-amber-600">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Action required</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Latest students who registered via the website.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reg Number</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.slice(0, 10).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs">{item.registrationNumber}</TableCell>
                          <TableCell className="font-medium">{item.fullName}</TableCell>
                          <TableCell>{item.schoolName}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.country}</TableCell>
                          <TableCell className="text-right">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${item.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {students.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No registrations yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          {schoolsGroups.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No schools or students registered yet.
              </CardContent>
            </Card>
          ) : schoolsGroups.map((group) => (
            <Card key={group.schoolName} className="overflow-hidden shadow-sm">
              <CardHeader className="bg-muted/30 border-b pb-4 pt-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg font-serif">
                       <GraduationCap className="h-5 w-5 text-primary" />
                       {group.schoolName}
                    </CardTitle>
                    <CardDescription className="mt-1.5 flex items-center gap-2">
                       <span className="font-medium text-foreground/80">{group.state}, {group.country}</span>
                       <span>•</span>
                       <span>{group.students.length} Student{group.students.length > 1 ? 's' : ''}</span>
                       <span>•</span>
                       <span className={group.verifiedCount === group.students.length ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                         {group.verifiedCount} Verified
                       </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                     {group.paymentProofUrl && (
                       <a href={group.paymentProofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
                         <Download className="w-4 h-4 mr-2" /> View Payment Receipt
                       </a>
                     )}
                     {group.verifiedCount < group.students.length && (
                       <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105 active:scale-95 shadow-sm" onClick={() => {
                          const conf = window.confirm(`Are you sure you want to verify all ${group.students.length - group.verifiedCount} pending student(s) for ${group.schoolName}?`);
                          if(conf) {
                             group.students.forEach(s => {
                               if (s.status === 'Pending') updateStudentStatus(s.id, 'Verified')
                             })
                          }
                       }}>
                         <Check className="w-4 h-4 mr-1.5" /> Verify All Pending
                       </Button>
                     )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                   <Table>
                      <TableHeader className="bg-muted/10">
                        <TableRow>
                          <TableHead className="pl-6">Reg Number</TableHead>
                          <TableHead>Student Details</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.students.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs pl-6">{item.registrationNumber}</TableCell>
                            <TableCell>
                               <div className="font-medium flex items-center gap-2">
                                 {item.fullName}
                                 {item.status === 'Verified' && <Check className="w-3.5 h-3.5 text-green-600" />}
                               </div>
                               <div className="text-xs text-muted-foreground capitalize mt-0.5">{item.gender} • {item.dob}</div>
                               <div className="flex gap-2">
                                 {item.passportUrl && (
                                    <a href={item.passportUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-1 text-[10px] inline-flex items-center">
                                      View Passport
                                    </a>
                                 )}
                                 {item.paymentProofUrl && (
                                    <a href={item.paymentProofUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-1 text-[10px] inline-flex items-center">
                                      View Receipt
                                    </a>
                                 )}
                               </div>
                            </TableCell>
                            <TableCell>
                               <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-muted/30">
                                 {item.category}
                               </span>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                               <div className="flex justify-end items-center gap-2">
                                 {item.status === 'Pending' ? (
                                   <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 h-8 transition-all shadow-sm hover:scale-105 active:scale-95" onClick={() => updateStudentStatus(item.id, 'Verified')}>
                                      Verify
                                   </Button>
                                 ) : (
                                   <span className="inline-flex h-7 items-center rounded-md px-2.5 text-[10px] font-medium bg-green-100/80 text-green-700 uppercase tracking-widest">Verified</span>
                                 )}
                                 <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive transition-all hover:scale-110 active:scale-90" onClick={() => handleDeleteStudent(item)}>
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {contentError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
               {contentError}
               <Button variant="ghost" size="sm" onClick={() => setContentError('')} className="h-6 w-6 p-0 hover:bg-destructive/20"><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Winner's Artwork</CardTitle>
                <CardDescription>Upload images for the Winner's Artwork section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Title / Caption</Label>
                     <Input placeholder="E.g., 1st Place Winner" value={winnerTitle} onChange={e => setWinnerTitle(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Project Name</Label>
                       <Input placeholder="E.g., Peace Dove" value={winnerProjectName} onChange={e => setWinnerProjectName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Age</Label>
                       <Input type="number" placeholder="E.g., 12" value={winnerAge} onChange={e => setWinnerAge(e.target.value)} />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Name of Person</Label>
                       <Input placeholder="E.g., John Doe" value={winnerPersonName} onChange={e => setWinnerPersonName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Country</Label>
                       <Input placeholder="E.g., UK" value={winnerCountry} onChange={e => setWinnerCountry(e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <Label>Category</Label>
                     <Select value={winnerType} onValueChange={(val: any) => setWinnerType(val)}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select a category" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="GRAND_PRIZES">Grand Prizes</SelectItem>
                         <SelectItem value="SPECIAL_AWARDS">Special Awards</SelectItem>
                         <SelectItem value="BEST_FINALISTS">Best Finalists</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div>
                     <Label>Artwork Image (Max 5MB)</Label>
                     <div className="mt-1 space-y-3">
                       {winnerFile ? (
                          <div className="flex items-center gap-2 text-sm border p-2 rounded">
                            <span className="truncate flex-1">{winnerFile.name}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setWinnerFile(null)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                       ) : (
                          <Label className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                            <UploadCloud className="w-4 h-4" /> Pick Image
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              if(e.target.files && e.target.files[0]) setWinnerFile(e.target.files[0]);
                            }} />
                          </Label>
                       )}
                       <div>
                         <Label className="text-xs text-muted-foreground mb-1 block">Or paste Image URLs</Label>
                         <textarea 
                           className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="https://... (Separate multiple URLs with newlines or commas)" value={winnerImageUrls} onChange={e => setWinnerImageUrls(e.target.value)} 
                         />
                       </div>
                     </div>
                   </div>
                   <Button onClick={handleAddWinner} className="w-full" disabled={isUploadingWinner}>
                     <Plus className="w-4 h-4 mr-2"/> {isUploadingWinner ? 'Uploading...' : "Add Winner's Artwork"}
                   </Button>
                </div>
                
                {winnersArtwork.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2">
                       {winnersArtwork.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded" />
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                             <p className="text-[10px] text-muted-foreground">{item.type.replace('_',' ')}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteWinnerArtwork(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Artwork Gallery</CardTitle>
                <CardDescription>Upload images for the main Artwork Gallery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Title / Caption</Label>
                     <Input placeholder="E.g., Beautiful landscape by Sarah" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Project Name</Label>
                       <Input placeholder="E.g., Summer Vibe" value={galleryProjectName} onChange={e => setGalleryProjectName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Age</Label>
                       <Input type="number" placeholder="E.g., 15" value={galleryAge} onChange={e => setGalleryAge(e.target.value)} />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Name of Person</Label>
                       <Input placeholder="E.g., Sarah" value={galleryPersonName} onChange={e => setGalleryPersonName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Country</Label>
                       <Input placeholder="E.g., Canada" value={galleryCountry} onChange={e => setGalleryCountry(e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <Label>Artwork Image (Max 5MB)</Label>
                     <div className="mt-1 space-y-3">
                       {galleryFile ? (
                          <div className="flex items-center gap-2 text-sm border p-2 rounded">
                            <span className="truncate flex-1">{galleryFile.name}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setGalleryFile(null)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                       ) : (
                          <Label className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                            <UploadCloud className="w-4 h-4" /> Pick Image
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              if(e.target.files && e.target.files[0]) setGalleryFile(e.target.files[0]);
                            }} />
                          </Label>
                       )}
                       <div>
                         <Label className="text-xs text-muted-foreground mb-1 block">Or paste Image URLs</Label>
                         <textarea 
                           className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="https://... (Separate multiple URLs with newlines or commas)" value={galleryImageUrls} onChange={e => setGalleryImageUrls(e.target.value)} 
                         />
                       </div>
                     </div>
                   </div>
                   <Button onClick={handleAddGallery} className="w-full" disabled={isUploadingGallery}>
                     <Plus className="w-4 h-4 mr-2"/> {isUploadingGallery ? 'Uploading...' : 'Add to Gallery'}
                   </Button>
                </div>
                
                {artworkGallery.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                       {artworkGallery.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded" />
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteArtworkGallery(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Activities</CardTitle>
                <CardDescription>Upload photos of activities happening across different countries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Title / Caption</Label>
                     <Input placeholder="E.g., Exhibition event" value={activityTitle} onChange={e => setActivityTitle(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Country</Label>
                       <Input placeholder="E.g., France" value={activityCountry} onChange={e => setActivityCountry(e.target.value)} />
                     </div>
                     <div>
                       <Label>Contest Number</Label>
                       <Input placeholder="E.g., 5" value={activityContestNumber} onChange={e => setActivityContestNumber(e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <Label>Activity Image (Max 5MB)</Label>
                     <div className="mt-1 space-y-3">
                       {activityFile ? (
                          <div className="flex items-center gap-2 text-sm border p-2 rounded">
                            <span className="truncate flex-1">{activityFile.name}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setActivityFile(null)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                       ) : (
                          <Label className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                            <UploadCloud className="w-4 h-4" /> Pick Image
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              if(e.target.files && e.target.files[0]) setActivityFile(e.target.files[0]);
                            }} />
                          </Label>
                       )}
                       <div>
                         <Label className="text-xs text-muted-foreground mb-1 block">Or paste Image URLs</Label>
                         <textarea 
                           className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="https://... (Separate multiple URLs with newlines or commas)" value={activityImageUrls} onChange={e => setActivityImageUrls(e.target.value)} 
                         />
                       </div>
                     </div>
                   </div>
                   <Button onClick={handleAddActivity} className="w-full" disabled={isUploadingActivity}>
                     <Plus className="w-4 h-4 mr-2"/> {isUploadingActivity ? 'Uploading...' : 'Add Activity'}
                   </Button>
                </div>
                
                {activities.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                       {activities.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded" />
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteActivity(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="w-5 h-5" /> Video Gallery</CardTitle>
                <CardDescription>Add video links for the Video Gallery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Video Title</Label>
                     <Input placeholder="E.g., 2025 Finals Highlight" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} />
                   </div>
                   <div>
                     <Label>Platform</Label>
                     <Select value={videoType} onValueChange={(val: any) => setVideoType(val)}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="youtube">YouTube</SelectItem>
                         <SelectItem value="drive">Google Drive</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div>
                     <Label>Video URL</Label>
                     <Input placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                   </div>
                   
                   <Button onClick={handleAddVideo} className="w-full"><Plus className="w-4 h-4 mr-2"/> Add Video</Button>
                </div>
                
                {videos.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                       {videos.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                             <p className="text-[10px] text-muted-foreground truncate">{item.videoUrl}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteVideo(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Change Password</CardTitle>
                  <CardDescription>Update your admin dashboard access password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <Button type="submit">Change Password</Button>
                    {pwdMsg && <p className={`text-sm ${pwdMsg.includes('success') ? 'text-green-600' : 'text-destructive'}`}>{pwdMsg}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}

