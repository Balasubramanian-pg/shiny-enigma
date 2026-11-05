"use client";

import React, { useState } from "react";
import {
  Shield,
  Send,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { sound } from "@/lib/sound";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    agency: "CBI Consultant",
    caseNumber: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.success();
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8102E] text-white">
            FIELD DISPATCH & CASE INTEL
          </span>
          <span className="text-xs text-neutral-400">California Bureau of Investigation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
          CBI Field Office & Tip Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-body">
          Direct behavioral analytical inquiries or submit case lead notifications to the Serious Crimes Unit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Field Stations Directory */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white font-heading">
              <Building className="w-4 h-4 text-[#C8102E]" />
              <span>CBI Sacramento Headquarters (Seasons 1–6)</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              California Bureau of Investigation Serious Crimes Unit, Division 4. Former office of Teresa Lisbon and Patrick Jane.
            </p>
            <div className="text-xs font-mono text-neutral-400 space-y-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>1100 Arden Way, Sacramento, CA 95815</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>(916) 555-0142</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white font-heading">
              <Shield className="w-4 h-4 text-[#C8102E]" />
              <span>FBI Austin Field Office (Seasons 6–7)</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Federal Bureau of Investigation Texas Division, Supervisory Agent Dennis Abbott. Consultant workspace of Patrick Jane.
            </p>
            <div className="text-xs font-mono text-neutral-400 space-y-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>900 San Jacinto Blvd, Austin, TX 78701</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>(512) 555-0189</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Form */}
        <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#12161F]/70 backdrop-blur-sm shadow-md">
          {submitted ? (
            <div className="p-8 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
                Intel Transmitted to Unit
              </h3>
              <p className="text-xs text-neutral-500">
                Your case memorandum has been cataloged in the local session log. Patrick Jane will review when convenient.
              </p>
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setSubmitted(false);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-heading">
                Submit Investigative Memo
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Agent / Analyst Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Special Agent Lisbon"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Field Bureau / Jurisdiction
                </label>
                <select
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                >
                  <option value="CBI Serious Crimes">CBI Serious Crimes Unit</option>
                  <option value="FBI Austin">FBI Austin Field Office</option>
                  <option value="CBI Forensics">CBI Crime Scene Forensics</option>
                  <option value="External Law Enforcement">External Law Enforcement / Police</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Case ID Reference
                </label>
                <input
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                  placeholder="e.g. RJ-2008-0116"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Behavioral Notes / Tip Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe suspect observations, forensic inconsistencies, or psychological markers..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                />
              </div>

              <button
                type="submit"
                onClick={() => sound.click()}
                className="w-full py-2.5 rounded-xl bg-[#C8102E] hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit to Serious Crimes Dispatch</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
