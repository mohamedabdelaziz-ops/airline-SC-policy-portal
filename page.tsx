'use client';

import { useState, useEffect } from 'react';
import airlinesData from './airlines.json';

interface ScheduleChange {
  minorChange: string;
  majorChange: string;
  threshold: string;
  travelWindow: string;
  beforeDeparture: string;
  afterDeparture: string;
  sameCabin: boolean;
  sameBookingClass: boolean;
  lowestAvailableClass: string;
  oalAllowed: boolean;
  ticketReissue: boolean;
  waiverRequired: boolean;
}

interface RefundPolicy {
  refundAllowed: boolean;
  refundThreshold: string;
  cancellationRefund: boolean;
  majorScheduleChangeRefund: boolean;
  penalty: string;
  waiverRequired: boolean;
}

interface Airline {
  airlineName: string;
  iata: string;
  icao: string;
  logo: string;
  lastUpdated: string;
  scheduleChange: ScheduleChange;
  refundPolicy: RefundPolicy;
}

export default function Home() {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filter Switch States
  const [filterSameCabin, setFilterSameCabin] = useState(false);
  const [filterSameClass, setFilterSameClass] = useState(false);
  const [filterOalAllowed, setFilterOalAllowed] = useState(false);
  const [filterRefundAllowed, setFilterRefundAllowed] = useState(false);

  useEffect(() => {
    setAirlines(airlinesData as Airline[]);
    if (airlinesData.length > 0) {
      setSelectedAirline(airlinesData[0] as Airline);
    }
  }, []);

  // Filter and Search Logic
  const filteredAirlines = airlines.filter((airline) => {
    const matchesSearch =
      airline.airlineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airline.iata.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airline.icao.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCabin = filterSameCabin ? airline.scheduleChange.sameCabin === true : true;
    const matchesClass = filterSameClass ? airline.scheduleChange.sameBookingClass === true : true;
    const matchesOal = filterOalAllowed ? airline.scheduleChange.oalAllowed === true : true;
    const matchesRefund = filterRefundAllowed ? airline.refundPolicy.refundAllowed === true : true;

    return matchesSearch && matchesCabin && matchesClass && matchesOal && matchesRefund;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Header Navigation Line */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌐</span>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                DISRUPTION DESK
              </h1>
              <p className="text-xs text-slate-400 font-medium">Airline Schedule Change & Refund Reference Hub</p>
            </div>
          </div>
          <div className="text-xs font-mono bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md text-sky-400">
            System Status: Live / Operational
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Control Panel / Search & Catalog Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Search Carrier Fleet
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Airline Name, IATA, ICAO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:outline-none text-white placeholder-slate-500 transition text-sm"
                />
              </div>
            </div>

            {/* Filter Controls Matrix */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Policy Filters
              </label>
              <label className="flex items-center space-x-3 text-sm cursor-pointer text-slate-300 hover:text-white transition">
                <input type="checkbox" checked={filterSameCabin} onChange={(e) => setFilterSameCabin(e.target.checked)} className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4" />
                <span>Same Cabin Only</span>
              </label>
              <label className="flex items-center space-x-3 text-sm cursor-pointer text-slate-300 hover:text-white transition">
                <input type="checkbox" checked={filterSameClass} onChange={(e) => setFilterSameClass(e.target.checked)} className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4" />
                <span>Same RBD Required</span>
              </label>
              <label className="flex items-center space-x-3 text-sm cursor-pointer text-slate-300 hover:text-white transition">
                <input type="checkbox" checked={filterOalAllowed} onChange={(e) => setFilterOalAllowed(e.target.checked)} className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4" />
                <span>OAL Rebook Allowed</span>
              </label>
              <label className="flex items-center space-x-3 text-sm cursor-pointer text-slate-300 hover:text-white transition">
                <input type="checkbox" checked={filterRefundAllowed} onChange={(e) => setFilterRefundAllowed(e.target.checked)} className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4" />
                <span>Refund Permitted</span>
              </label>
            </div>
          </div>

          {/* Results Grid List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <span className="text-xs font-semibold text-slate-400 block mb-3 px-1 uppercase tracking-wider">
              Airlines Catalog ({filteredAirlines.length})
            </span>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {filteredAirlines.map((airline) => (
                <button
                  key={airline.iata}
                  onClick={() => setSelectedAirline(airline)}
                  className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition ${
                    selectedAirline?.iata === airline.iata
                      ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{airline.logo}</span>
                    <span className="font-semibold text-sm">{airline.airlineName}</span>
                  </div>
                  <span className="font-mono text-xs opacity-70">[{airline.iata}]</span>
                </button>
              ))}
              {filteredAirlines.length === 0 && (
                <div className="text-center py-6 text-sm text-slate-500">No airlines match criteria.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Details Panel View */}
        <div className="lg:col-span-3 space-y-6">
          {selectedAirline ? (
            <>
              {/* Airline Profile Identity Header Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl bg-slate-950 p-3 rounded-xl border border-slate-700 shadow-inner">
                    {selectedAirline.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{selectedAirline.airlineName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      GDS Codes: IATA: <span className="text-sky-400 font-mono font-bold">{selectedAirline.iata}</span> | ICAO: <span className="text-sky-400 font-mono font-bold">{selectedAirline.icao}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Database Profile Valid</span>
                  <span className="text-sm font-mono text-indigo-300 font-medium">{selectedAirline.lastUpdated}</span>
                </div>
              </div>

              {/* Requirement Quick Summary Matrix Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center shadow-md">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">SKD CHG Trigger</span>
                  <span className="text-base font-bold text-amber-400 mt-1 block">{selectedAirline.scheduleChange.threshold}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center shadow-md">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Travel Window</span>
                  <span className="text-base font-bold text-sky-400 mt-1 block">{selectedAirline.scheduleChange.travelWindow}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center shadow-md">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">OAL Rebooking</span>
                  <span className={`text-base font-bold mt-1 block ${selectedAirline.scheduleChange.oalAllowed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedAirline.scheduleChange.oalAllowed ? 'ALLOWED' : 'PROHIBITED'}
                  </span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center shadow-md">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Refund Eligibility</span>
                  <span className={`text-base font-bold mt-1 block ${selectedAirline.refundPolicy.refundAllowed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedAirline.refundPolicy.refundAllowed ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>

              {/* Two-Column Deep-Dive Policy Rules Panel Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Rebooking & Schedule Change Panel Core Layout */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <span className="text-lg">🔄</span>
                    <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Schedule Change Framework</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Minor Change Profile</span>
                      <span className="font-medium text-slate-200">{selectedAirline.scheduleChange.minorChange}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Major Change Profile</span>
                      <span className="font-medium text-slate-200">{selectedAirline.scheduleChange.majorChange}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Cabin Matching Rules</span>
                      <span className="font-medium text-slate-200">{selectedAirline.scheduleChange.sameCabin ? "Strict Balance Required" : "Alternative Class Permitted"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Booking Class (RBD)</span>
                      <span className="font-medium text-slate-200">{selectedAirline.scheduleChange.sameBookingClass ? "Exact RBD Match Required" : "Lowest Class Allowed"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Inventory Fallback Target</span>
                      <span className="font-medium text-indigo-300 font-mono text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{selectedAirline.scheduleChange.lowestAvailableClass}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Ticket Reissue Required</span>
                      <span className={`font-semibold ${selectedAirline.scheduleChange.ticketReissue ? 'text-amber-400' : 'text-slate-400'}`}>{selectedAirline.scheduleChange.ticketReissue ? "YES - Reissue Needed" : "NO - Authority Waiver Only"}</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-slate-400">GDS Endorsement Waiver</span>
                      <span className={`font-semibold ${selectedAirline.scheduleChange.waiverRequired ? 'text-amber-400' : 'text-emerald-400'}`}>{selectedAirline.scheduleChange.waiverRequired ? "Mandatory Waiver Code" : "Automated Verification Code"}</span>
                    </div>
                  </div>
                </div>

                {/* Refund Rules Protection Panel Core Layout */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <span className="text-lg">💰</span>
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Refund Protocols</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Involuntary Cancellation Refund</span>
                      <span className="font-medium text-emerald-400">{selectedAirline.refundPolicy.cancellationRefund ? "Full Refund Authorized" : "Credit Shell Voucher"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Significant Change Trigger</span>
                      <span className="font-medium text-slate-200">{selectedAirline.refundPolicy.refundThreshold}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Major Change Protection</span>
                      <span className="font-medium text-slate-200">{selectedAirline.refundPolicy.majorScheduleChangeRefund ? "Fully Covered" : "Subject to Assessment"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                      <span className="text-slate-400">Involuntary Admin Penalties</span>
                      <span className="font-medium text-slate-200 font-mono text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{selectedAirline.refundPolicy.penalty}</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-slate-400">GDS Refund Waiver Injection</span>
                      <span className={`font-semibold ${selectedAirline.refundPolicy.waiverRequired ? 'text-amber-400' : 'text-emerald-400'}`}>{selectedAirline.refundPolicy.waiverRequired ? "Waiver Input Mandatory" : "System Validation Exempt"}</span>
                    </div>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl h-72 flex flex-col items-center justify-center text-slate-500 shadow-xl">
              <span className="text-4xl mb-3">✈️</span>
              <span className="font-semibold text-slate-400">No Carrier Selection Detected</span>
              <p className="text-xs text-slate-600 mt-1">Please select an operating airline carrier from the left dashboard list view.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
