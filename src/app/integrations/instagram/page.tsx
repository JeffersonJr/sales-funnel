"use client";
import React from "react";
import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InstagramIntegrationPage() {
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Instagram Integration</h1>
        </div>
      </div>
      <div className="bg-white p-20 rounded-[3rem] border border-gray-100 shadow-xl text-center">
         <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
            <Camera size={48} />
         </div>
         <h2 className="text-2xl font-black text-gray-900 mb-4">Conecte seu Perfil Business</h2>
         <p className="text-gray-500 max-w-md mx-auto mb-10">Capture leads via Direct e automatize suas respostas com nossa IA.</p>
         <button className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-pink-600 transition-all">
            Conectar com Facebook
         </button>
      </div>
    </div>
  );
}
