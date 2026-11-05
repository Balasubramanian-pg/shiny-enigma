"use client";

import React, { useState } from "react";
import {
  Shield,
  Send,
  Building,
  MapPin,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { sound } from "@/lib/sound";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    agency: "CBI Serious Crimes",
    caseNumber: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.success();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header - Editorial headline without eyebrow pill */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
          CBI Field Office & Tip Dispatch
        </h1>
        <p className="mt-2 text-sm text-muted">
          Direct behavioral analytical inquiries or submit case lead notifications to the Serious Crimes Unit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Field Stations Directory */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-rule bg-paper-2 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Building className="w-4 h-4 text-accent" aria-hidden="true" />
              <span>CBI Sacramento Headquarters (Seasons 1 to 6)</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              California Bureau of Investigation Serious Crimes Unit, Division 4. Former office of Special Agent Teresa Lisbon and consultant Patrick Jane.
            </p>
            <div className="text-xs text-muted space-y-1.5 pt-3 border-t border-rule">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
                <span>1100 Arden Way, Sacramento, CA 95815</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
                <span className="tabular-nums">(916) 555-0142</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-rule bg-paper-2 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Shield className="w-4 h-4 text-accent" aria-hidden="true" />
              <span>FBI Austin Field Office (Seasons 6 to 7)</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Federal Bureau of Investigation Texas Division, Supervisory Special Agent Dennis Abbott. Dedicated workspace of consultant Patrick Jane.
            </p>
            <div className="text-xs text-muted space-y-1.5 pt-3 border-t border-rule">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
                <span>900 San Jacinto Blvd, Austin, TX 78701</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
                <span className="tabular-nums">(512) 555-0189</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Form */}
        <div className="p-6 rounded-xl border border-rule bg-paper-2 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 text-accent mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-ink">
                Intel Transmitted to Serious Crimes
              </h2>
              <p className="text-xs text-muted">
                Your case memorandum has been cataloged in the local session log. Patrick Jane will review when convenient.
              </p>
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setSubmitted(false);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-paper-3 text-ink hover:border-accent/40 border border-rule active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-semibold text-ink">
                Submit Investigative Memo
              </h2>

              <div>
                <label htmlFor="agent-name" className="block text-xs font-medium text-ink-2 mb-1">
                  Agent or Analyst Name
                </label>
                <input
                  id="agent-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Special Agent Lisbon"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rule bg-paper text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40"
                />
              </div>

              <div>
                <label htmlFor="field-bureau" className="block text-xs font-medium text-ink-2 mb-1">
                  Field Bureau or Jurisdiction
                </label>
                <select
                  id="field-bureau"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rule bg-paper text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40"
                >
                  <option value="CBI Serious Crimes">CBI Serious Crimes Unit</option>
                  <option value="FBI Austin">FBI Austin Field Office</option>
                  <option value="CBI Forensics">CBI Crime Scene Forensics</option>
                  <option value="External Law Enforcement">External Law Enforcement or Police</option>
                </select>
              </div>

              <div>
                <label htmlFor="case-number" className="block text-xs font-medium text-ink-2 mb-1">
                  Case ID Reference
                </label>
                <input
                  id="case-number"
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                  placeholder="e.g. RJ-2008-0116"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rule bg-paper text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40 tabular-nums"
                />
              </div>

              <div>
                <label htmlFor="tip-details" className="block text-xs font-medium text-ink-2 mb-1">
                  Behavioral Notes and Tip Details
                </label>
                <textarea
                  id="tip-details"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe suspect observations, forensic inconsistencies, or psychological markers..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rule bg-paper text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40"
                />
              </div>

              <button
                type="submit"
                onClick={() => sound.click()}
                className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-accent-ink font-semibold text-xs flex items-center justify-center gap-2 whitespace-nowrap active:opacity-85 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-150 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Transmit Dispatch</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
