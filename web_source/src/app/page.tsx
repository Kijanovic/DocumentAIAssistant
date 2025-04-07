import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            DocumentAI Web Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interact with your documents using the power of Gemini AI. Upload PDFs and Word documents, 
            ask questions, and get answers with precise references to your source materials.
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                Powerful Document Analysis
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Upload PDF and Word documents for instant analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ask questions in natural language about your documents</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Get precise answers with references to specific pages and sections</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Choose between Gemini Flash and Pro models for different needs</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link 
                  href="/dashboard" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Example Query</h3>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 font-medium">Question:</p>
                <p className="bg-gray-100 p-3 rounded mt-1">What are the key benefits of artificial intelligence in healthcare according to the report?</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Answer:</p>
                <div className="bg-blue-50 p-3 rounded mt-1">
                  <p className="mb-2">According to the report, the key benefits of AI in healthcare include:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Improved diagnostic accuracy by 30-40% compared to traditional methods</li>
                    <li>Reduced treatment planning time by up to 60%</li>
                    <li>Enhanced patient monitoring through predictive analytics</li>
                    <li>Cost reduction in administrative processes by automating routine tasks</li>
                  </ol>
                  <p className="mt-2 text-sm text-blue-600">References: Healthcare AI Report 2025, Page 42, Section: "Key Benefits"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
