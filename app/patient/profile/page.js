'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import PatientLayoutWrapper from '../../../components/layout/PatientLayoutWrapper';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: ''
  });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('tbl_patient').select('*').eq('user_id', user.id).single();
      setPatient(data);
      setFormData({
        name: data.patient_name || '',
        email: data.patient_email || '', 
        phone: data.patient_contact || '',
        address: data.patient_address || '',
        password: ''
      });
    }
    setLoading(false);
  }

  const handleUpdate = async () => {
    setUpdating(true);
    
    // 1. Update Password ONLY if provided (skipping email to avoid sandbox error)
    if (formData.password) {
      const { error: authError } = await supabase.auth.updateUser({ 
          password: formData.password 
      });
      if (authError) {
        alert("Security Update Error: " + authError.message);
        setUpdating(false);
        return;
      }
    }

    // 2. Update Database Record
    const { error: dbError } = await supabase.from('tbl_patient').update({
        patient_name: formData.name,
        patient_contact: formData.phone,
        patient_address: formData.address
    }).eq('user_id', patient.user_id);

    if (dbError) {
      alert("Database Error: " + dbError.message);
      setUpdating(false);
    } else {
      setShowSuccess(true); 
    }
  };

  const handleFinalLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirecting to your root (app/page.js)
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Loading Record...</div>;

  return (
    <PatientLayoutWrapper pageTitle="Patient Profile" patientData={patient}>
      
      {showSuccess && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <FaCheckCircle size={80} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black uppercase leading-tight mb-4">Profile Updated</h2>
            <p className="text-slate-500 font-medium mb-8">Your information has been saved successfully. For security, please log in again.</p>
            <button 
              onClick={handleFinalLogout}
              className="w-full bg-[#F17343] hover:bg-orange-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-200 uppercase tracking-widest"
            >
              Confirm & Re-login <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6 relative">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border-b-8 border-[#F17343]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="bg-slate-800 p-2 rounded-full border-4 border-slate-700 text-slate-500">
              <FaUserCircle size={100} />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[#F17343] font-black uppercase text-[10px] tracking-[0.3em] mb-1">Official Patient Record</p>
              {isEditing ? (
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-800 border border-slate-700 text-white p-2 rounded-lg text-2xl font-black w-full outline-none focus:ring-2 focus:ring-[#F17343]"
                />
              ) : (
                <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">
                  {patient?.patient_name}
                </h1>
              )}
              <p className="text-slate-400 font-medium tracking-wide">ID: #PX-{patient?.id?.toString().padStart(4, '0')}</p>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
            disabled={updating}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all shadow-lg text-white ${
              isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#F17343] hover:bg-orange-600'
            }`}
          >
            {updating ? 'Saving...' : isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 opacity-60">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><FaEnvelope /></div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Login Email (Permanent)</p>
                  <p className="font-bold text-slate-500">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-2xl text-green-600"><FaPhone /></div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Phone Number</p>
                  <input 
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-transparent font-bold text-slate-700 outline-none border-b border-transparent focus:border-green-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location & Security</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-2xl text-[#F17343]"><FaMapMarkerAlt /></div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Home Address</p>
                  <input 
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-transparent font-bold text-slate-700 outline-none border-b border-transparent focus:border-[#F17343] transition-colors"
                  />
                </div>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <div className="bg-red-50 p-3 rounded-2xl text-red-600"><FaLock /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-red-400 uppercase">Change Password</p>
                    <input 
                      type="password"
                      placeholder="Enter new password"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-transparent font-bold text-slate-700 outline-none border-b border-red-200 text-slate-900 placeholder:text-slate-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="bg-purple-50 p-3 rounded-2xl text-purple-600"><FaCalendarAlt /></div>
                  <div className="flex-1 text-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Patient Since</p>
                    <p className="font-bold">{new Date(patient?.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isEditing && (
            <button 
                onClick={() => {setIsEditing(false); fetchProfileData();}}
                className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors"
            >
                Discard Changes
            </button>
        )}
      </div>
    </PatientLayoutWrapper>
  );
}