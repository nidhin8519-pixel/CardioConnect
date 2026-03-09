import React, { useRef, useState } from 'react';
import { ClassificationResult } from '../services/geminiService';
import { FileText, Volume2, VolumeX, AlertTriangle, CheckCircle, Info, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportProps {
  result: ClassificationResult;
}

export default function Report({ result }: ReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const riskColors = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  const riskIcons = {
    low: <CheckCircle className="w-6 h-6 text-emerald-500" />,
    medium: <Info className="w-6 h-6 text-yellow-500" />,
    high: <AlertTriangle className="w-6 h-6 text-red-500" />,
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('CardioSense_Report.pdf');
    } catch (error) {
      console.error('Failed to generate PDF', error);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToSpeak = `
        CardioSense AI Report.
        Disease Classification: ${result.classification}.
        Risk Level: ${result.riskLevel}.
        Reasoning: ${result.reasoning}.
        Suggested Therapeutics: ${result.therapeutics.join(', ')}.
        Confirmatory Tests: ${result.confirmatoryTests.join(', ')}.
      `;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          Analysis Report
        </h2>
        <div className="flex gap-3">
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isSpeaking ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSpeaking ? 'Stop Reading' : 'Read Report'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div ref={reportRef} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
        <div className="text-center pb-6 border-b border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CardioSense AI</h1>
          <p className="text-slate-500">Automated ECG & PCG Analysis Report</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Classification</h3>
            <p className="text-2xl font-bold text-indigo-900">{result.classification}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Risk Level</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${riskColors[result.riskLevel]}`}>
              {riskIcons[result.riskLevel]}
              <span className="font-bold capitalize text-lg">{result.riskLevel} Risk</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Clinical Reasoning</h3>
          <p className="text-slate-700 leading-relaxed">{result.reasoning}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Suggested Therapeutics</h3>
            <ul className="space-y-3">
              {result.therapeutics.map((therapy, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5">{therapy}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Confirmatory Tests</h3>
            <ul className="space-y-3">
              {result.confirmatoryTests.map((test, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                  <span className="mt-0.5">{test}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-slate-100 text-center text-sm text-slate-400">
          <p>This report is generated by an AI model and is for informational purposes only. It does not replace professional medical advice, diagnosis, or treatment.</p>
        </div>
      </div>
    </div>
  );
}
