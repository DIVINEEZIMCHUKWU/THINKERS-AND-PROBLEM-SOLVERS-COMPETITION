import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, UploadCloud, Info, Plus, Trash2, FileSpreadsheet, MessageCircle } from 'lucide-react'
import { useAppStore } from '@/store'
import * as XLSX from 'xlsx'

import { uploadFileToSupabase, saveToSupabaseTable } from '@/lib/supabase'

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
};

const studentSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  category: z.string().min(1, "Please select a category"),
  passportFileBase64: z.string().optional(),
  passportFileName: z.string().optional()
})

const formSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  paymentProofBase64: z.string().optional(),
  paymentProofFileName: z.string().optional(),
  students: z.array(studentSchema).min(1, "At least one student must be added"),
})

export default function StudentRegistration() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingFilesCount, setUploadingFilesCount] = useState(0)
  const [successData, setSuccessData] = useState<{count: number, regNumbers: string[]}>({ count: 0, regNumbers: [] })
  
  const addStudentToStore = useAppStore(state => state.addStudent)

  const { register, control, handleSubmit, trigger, formState: { errors }, setValue, watch } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      students: [{ fullName: '', dob: '', gender: '', category: '', passportFileBase64: '', passportFileName: '' }],
      paymentProofBase64: '',
      paymentProofFileName: ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students"
  })

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = file.name;
      
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as any[];

        if (jsonData.length === 0) {
          alert('The uploaded file is empty.');
          return;
        }

        // Remove empty default rows if only one exists and it's empty
        if (fields.length === 1 && !watch('students.0.fullName')) {
          remove(0);
        }

        // Add parsed students
        let addedCount = 0;
        jsonData.forEach(row => {
           // Provide a case-insensitive fallback mapping
           const keys = Object.keys(row);
           const getVal = (matches: RegExp) => {
             const key = keys.find(k => matches.test(k.toLowerCase().replace(/[^a-z0-9]/g, '')));
             return key ? row[key] : '';
           };

           let fullName = getVal(/name|fullname|student|child|applicant/) || '';
           let dob = getVal(/dob|date|birth|age|year/) || '';
           let gender = getVal(/gender|sex|male|female/) || '';
           let category = getVal(/category|event|class/) || '';
           
           // Fallback to absolute positional if we couldn't match headers, assuming standard format Name, DOB, Gender, Category
           if (!fullName && keys.length >= 1) fullName = String(row[keys[0]] || '').trim();
           if (!dob && keys.length >= 2) dob = String(row[keys[1]] || '').trim();
           if (!gender && keys.length >= 3) gender = String(row[keys[2]] || '').trim();
           if (!category && keys.length >= 4) category = String(row[keys[3]] || '').trim();
           
           if(fullName) {
             let parsedGender = String(gender).toLowerCase().trim();
             if(parsedGender !== 'male' && parsedGender !== 'female') parsedGender = 'other';
             
             // Try to make sure dob is formatted closely as YYYY-MM-DD
             let parsedDob = dob;
             if (typeof dob === 'number') {
                const date = new Date((dob - (25567 + 2)) * 86400 * 1000); 
                if(!isNaN(date.getTime())) {
                  parsedDob = date.toISOString().split('T')[0];
                }
             } else if (typeof dob === 'string') {
               // Handled mixed mm/dd/yyyy or similar
               const parts = dob.trim().split(/[-\/]/);
               if (parts.length === 3) {
                 // Try parsing, assuming it might be m/d/yyyy or yyyy-m-d or d-m-yyyy
                 // the safest is Date.parse if it's in a known locale
                 const attemptDate = new Date(dob.trim());
                 if (!isNaN(attemptDate.getTime())) {
                   parsedDob = attemptDate.toISOString().split('T')[0];
                 }
               }
             }

             append({
                fullName: String(fullName),
                dob: typeof parsedDob === 'string' && parsedDob.length >= 8 ? parsedDob : '2010-01-01',
                gender: parsedGender,
                category: String(category) || 'Art Drawing',
                passportFileBase64: '',
                passportFileName: ''
             });
             addedCount++;
           }
        });
        
        alert(`Successfully imported ${addedCount} students from "${fileName}".`);

      } catch (err) {
        console.error("Excel Upload Error:", err);
        alert('Failed to parse file. Please upload a valid XLSX.\nError: ' + String(err));
      }
      
      // Reset input
      e.target.value = '';
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const addedRegNumbers: string[] = [];
      
      for (const s of data.students) {
        const regNo = `TPSC-26-${Math.floor(1000 + Math.random() * 9000)}`;
        addedRegNumbers.push(regNo);
        
        const payload = {
          registration_number: regNo,
          full_name: s.fullName,
          dob: s.dob,
          gender: s.gender,
          country: data.country,
          state: data.state,
          school_name: data.schoolName,
          category: s.category,
          passport_url: s.passportFileBase64 || 'https://i.ibb.co/C0bXZn0k/placeholder_avatar.jpg',
          payment_proof_url: data.paymentProofBase64 || 'https://i.ibb.co/C0bXZn0k/placeholder_receipt.jpg',
          status: 'Pending'
        };
        
        const dbRes = await saveToSupabaseTable('students', payload);
        if (!dbRes.success) {
           throw new Error(dbRes.error || 'Failed to save to database');
        }
        
        addStudentToStore({
          registrationNumber: regNo,
          fullName: s.fullName,
          dob: s.dob,
          gender: s.gender,
          country: data.country,
          state: data.state,
          schoolName: data.schoolName,
          category: s.category,
          passportUrl: payload.passport_url,
          paymentProofUrl: payload.payment_proof_url
        });
      }

      setSuccessData({ count: data.students.length, regNumbers: addedRegNumbers });
      setStep(3);
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-4">Registration Successful!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Your application for {successData.count} student(s) has been received. 
        </p>
        <div className="bg-muted p-4 rounded-xl text-left mb-8 max-h-48 overflow-y-auto">
          <h4 className="font-semibold mb-2 text-sm uppercase tracking-widest text-muted-foreground">Registration Numbers</h4>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {successData.regNumbers.map((num, i) => (
               <li key={i} className="font-mono font-bold text-foreground bg-background border px-2 py-1 rounded text-center">
                  {num}
               </li>
            ))}
          </ul>
        </div>
        <div className="mb-8">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 h-12 px-6"
            onClick={() => window.open('https://wa.me/', '_blank')}
          >
            <MessageCircle className="h-5 w-5" /> Reach Out Here on Whatsapp
          </Button>
        </div>
        <Button size="lg" className="transition-all hover:scale-105 active:scale-95 shadow-md" onClick={() => window.location.href = '/'}>Return to Home</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 w-full max-w-7xl py-12 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-1 space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-4">Batch Registration</h1>
          <p className="text-muted-foreground">Quickly register multiple students from your school for the upcoming international competition cycle.</p>
        </div>

        <div className="space-y-4">
          <div className={`p-4 border rounded-xl transition-colors ${step === 1 ? 'bg-primary/5 border-primary shadow-sm' : 'bg-muted/30 border-transparent opacity-60'}`}>
            <h3 className="font-semibold text-sm tracking-wider uppercase mb-1">Step 1</h3>
            <p>School & Contact Info</p>
          </div>
          <div className={`p-4 border rounded-xl transition-colors ${step === 2 ? 'bg-primary/5 border-primary shadow-sm' : 'bg-muted/30 border-transparent opacity-60'}`}>
            <h3 className="font-semibold text-sm tracking-wider uppercase mb-1">Step 2</h3>
            <p>Students & Payment</p>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Payment Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground">UBA Bank</p>
              <p className="font-mono font-medium text-base">1030026516</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">ACCESS Bank</p>
              <p className="font-mono font-medium text-base">1972964729</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Account Name:<br />
              <strong>THINKERS AND PROBLEM SOLVERS COMPETITION</strong>
            </p>
            
            <a href="https://wa.me/2348103833239" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 mt-6 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition-colors">
              SEND PAYMENT RECEIPT VIA WHATSAPP
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="border-border/50 shadow-lg relative h-full">
          <CardContent className="p-6 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className={step === 1 ? 'block animate-in slide-in-from-right-4 fade-in duration-300' : 'hidden'}>
                <h2 className="text-xl font-serif font-bold mb-6 pb-2 border-b">School & Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input id="schoolName" {...register("schoolName")} placeholder="Name of institution" />
                    {errors.schoolName && <p className="text-xs text-destructive">{errors.schoolName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...register("country")} placeholder="e.g. Nigeria" />
                    {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" {...register("state")} placeholder="e.g. Lagos" />
                    {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                  </div>
                </div>

                <hr className="my-8 border-border/50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact / Coordinator Name</Label>
                    <Input id="contactName" {...register("contactName")} placeholder="Full name" />
                    {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input id="contactPhone" {...register("contactPhone")} placeholder="+234..." />
                    {errors.contactPhone && <p className="text-xs text-destructive">{errors.contactPhone.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="school@email.com" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <Button type="button" className="transition-all hover:scale-105 active:scale-95 shadow-md" onClick={async () => {
                     // Check step 1 fields
                     const valid = await trigger(["schoolName", "country", "state", "contactName", "contactPhone", "email"])
                     if (valid) setStep(2);
                  }}>Continue to Students</Button>
                </div>
              </div>

              <div className={step === 2 ? 'block animate-in slide-in-from-right-4 fade-in duration-300' : 'hidden'}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b gap-4">
                   <div>
                     <h2 className="text-xl font-serif font-bold">Register Students</h2>
                     <p className="text-sm text-muted-foreground mt-1">Enter details manually or upload an Excel file.</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <Badge variant="secondary" className="text-sm px-3">{fields.length} Student{fields.length !== 1 && 's'}</Badge>
                     <Label className="flex items-center gap-2 border bg-secondary/50 hover:bg-secondary h-9 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors shadow-sm whitespace-nowrap">
                        <FileSpreadsheet className="w-4 h-4 ml-[-4px]" /> Bulk Upload (XLSX)
                        <input type="file" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" onChange={handleExcelUpload} />
                     </Label>
                   </div>
                </div>
                
                {errors.students?.root && <p className="text-sm text-destructive mb-4">{errors.students.root.message}</p>}

                <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 pb-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="relative bg-muted/20">
                      <CardContent className="p-4 md:p-6">
                        {fields.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-all hover:scale-110 active:scale-90"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                           <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
                           Student Details
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label>Full Name</Label>
                            <Input {...register(`students.${index}.fullName`)} placeholder="Student's name" />
                            {errors?.students?.[index]?.fullName && <p className="text-xs text-destructive">{errors.students[index]?.fullName?.message}</p>}
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <Input type="date" {...register(`students.${index}.dob`)} />
                            {errors?.students?.[index]?.dob && <p className="text-xs text-destructive">{errors.students[index]?.dob?.message}</p>}
                          </div>
                          
                          <div className="space-y-2">
                             <Label>Gender</Label>
                             <Select onValueChange={(val) => setValue(`students.${index}.gender` as any, val)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                             </Select>
                             {errors?.students?.[index]?.gender && <p className="text-xs text-destructive">{errors.students[index]?.gender?.message}</p>}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Competition Category</Label>
                            <Select onValueChange={(val) => setValue(`students.${index}.category` as any, val)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Art Drawing">Art Drawing</SelectItem>
                                <SelectItem value="Painting">Painting</SelectItem>
                                <SelectItem value="Nature Drawing">Nature Drawing</SelectItem>
                                <SelectItem value="Cultural Art">Cultural Art</SelectItem>
                                <SelectItem value="Abstract Art">Abstract Art</SelectItem>
                                <SelectItem value="Digital Art">Digital Art</SelectItem>
                                <SelectItem value="French Spelling Bee">French Spelling Bee</SelectItem>
                                <SelectItem value="French Essay Writing">French Essay Writing</SelectItem>
                                <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                                <SelectItem value="Dictation">Dictation</SelectItem>
                                <SelectItem value="Creative Problem Solving">Creative Problem Solving</SelectItem>
                                <SelectItem value="All">All Categories</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors?.students?.[index]?.category && <p className="text-xs text-destructive">{errors.students[index]?.category?.message}</p>}
                          </div>

                          <div className="space-y-2 md:col-span-2 mt-2">
                            <Label>Student Passport Photograph <span className="text-muted-foreground text-xs font-normal">(Required)</span></Label>
                            <div className="flex items-center gap-4">
                                <Label className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95">
                                  <UploadCloud className="w-4 h-4" /> Upload Photo
                                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      setValue(`students.${index}.passportFileName`, file.name);
                                      setUploadingFilesCount(prev => prev + 1);
                                      try {
                                        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                                        const url = await handleFileUpload(file, 'tpsc-images', `passports/${Date.now()}_${sanitizedFileName}`);
                                        setValue(`students.${index}.passportFileBase64`, url);
                                      } catch (error: any) {
                                        alert(error.message);
                                        setValue(`students.${index}.passportFileName`, '');
                                      } finally {
                                        setUploadingFilesCount(prev => prev - 1);
                                      }
                                    }
                                  }} />
                                </Label>
                                {watch(`students.${index}.passportFileName` as any) && <span className="text-xs text-green-600 font-medium truncate max-w-[150px]">{watch(`students.${index}.passportFileName` as any)}</span>}
                            </div>
                            {/* Hidden input to track via rhf if needed */}
                            <input type="hidden" {...register(`students.${index}.passportFileBase64` as any)} />
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-dashed transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md"
                    onClick={() => append({ fullName: '', dob: '', gender: '', category: '', passportFileBase64: '', passportFileName: '' })}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Another Student
                  </Button>
                </div>

                <hr className="my-8 border-border/50" />

                <div className="mb-8 p-6 bg-muted/30 rounded-xl border border-dashed flex flex-col items-center text-center">
                  <UploadCloud className="w-10 h-10 mb-4 text-primary" />
                  <h4 className="font-semibold mb-1">Upload Batch Proof of Payment</h4>
                  <p className="text-sm text-muted-foreground mb-4">Upload the combined receipt for all registered students (JPEG/PNG/PDF)</p>
                  
                  <Label className="flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95">
                    Select Receipt
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={async e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setValue('paymentProofFileName', file.name)
                        setUploadingFilesCount(prev => prev + 1);
                        try {
                          const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                          const url = await handleFileUpload(file, 'tpsc-images', `receipts/${Date.now()}_${sanitizedFileName}`);
                          setValue('paymentProofBase64', url, { shouldValidate: true, shouldDirty: true });
                        } catch (error: any) {
                          alert(error.message);
                          setValue('paymentProofFileName', '');
                        } finally {
                          setUploadingFilesCount(prev => prev - 1);
                        }
                      }
                    }} />
                  </Label>
                  <input type="hidden" {...register('paymentProofBase64')} />
                  {watch('paymentProofFileName' as any) && <p className="text-xs text-green-600 mt-3 font-medium truncate max-w-sm">{watch('paymentProofFileName' as any)}</p>}
                </div>

                <div className="pt-6 flex justify-between border-t border-border/50">
                  <Button type="button" variant="outline" className="transition-all hover:scale-105 active:scale-95 shadow-sm" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" disabled={isSubmitting || uploadingFilesCount > 0} className="transition-all hover:scale-105 active:scale-95 shadow-md">
                    {uploadingFilesCount > 0 ? "Uploading files..." : isSubmitting ? "Submitting..." : `Register ${fields.length} Student${fields.length > 1 ? 's' : ''}`}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

