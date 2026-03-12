import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-12">
            <h1 className="text-6xl sm:text-7xl font-bold text-slate-900 mb-3 tracking-tight">
              EXTATE
            </h1>
            <div className="h-1 w-32 bg-blue-600 mx-auto"></div>
          </div>

          {/* Emotional Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
            Your property.
            <br />
            <span className="text-blue-600">Protected forever.</span>
          </h2>

          {/* Problem & Solution Statement */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-6">
              Your land has no formal registry. Your deed is stored at home where floods can destroy it. 
              Officials demand bribes to "verify" your ownership. You fled conflict and returned to find 
              strangers claiming your property. The inheritance deed no longer exists.
            </p>
            <p className="text-xl sm:text-2xl text-slate-900 font-semibold leading-relaxed">
              EXTATE creates a permanent digital certificate that proves your document existed and cannot be altered — 
              proof that survives disasters, corruption, and time.
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/upload"
            className="inline-block px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xl transition-all duration-200 text-xl hover:shadow-2xl hover:scale-105"
          >
            Register a Document
          </Link>

          {/* Trust Badge */}
          <p className="mt-6 text-sm text-slate-500">
            Free • Secure • Instant verification
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
            How it works
          </h3>
          <p className="text-center text-slate-600 mb-16 text-lg max-w-2xl mx-auto">
            Three simple steps to protect your most important documents
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Upload your document
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Upload your property deed, title, inheritance record, or tax document. 
                We create a unique digital fingerprint that proves its authenticity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
                2
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Get a certificate
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Receive an official certificate with a cryptographic fingerprint. 
                Download it, print it, share it — it's permanent proof of your document.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
                3
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Verify anytime
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Anyone can verify your document's authenticity at any time. 
                The proof is permanent and can never be altered or destroyed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who This Is For Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
            Who this is for
          </h3>
          <p className="text-center text-slate-600 mb-16 text-lg max-w-2xl mx-auto">
            EXTATE protects families in situations where traditional systems fail
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Persona 1 */}
            <div className="bg-slate-50 rounded-lg p-8 border-l-4 border-blue-600">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Paper documents at risk
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Your only proof of ownership is a paper deed stored at home. Your area floods every year. 
                Fire is common. One disaster could destroy everything your family owns.
              </p>
            </div>

            {/* Persona 2 */}
            <div className="bg-slate-50 rounded-lg p-8 border-l-4 border-blue-600">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                No official records exist
              </h4>
              <p className="text-slate-600 leading-relaxed">
                The local land registry office was destroyed or corrupted. Records no longer exist. 
                Officials cannot verify your ownership. You have no way to prove your land is yours.
              </p>
            </div>

            {/* Persona 3 */}
            <div className="bg-slate-50 rounded-lg p-8 border-l-4 border-blue-600">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Displaced and returning home
              </h4>
              <p className="text-slate-600 leading-relaxed">
                You fled conflict and left everything behind. Now you return to find strangers living on your land. 
                They claim it's theirs. You have no documents to prove otherwise.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
              In all these situations, EXTATE gives you permanent proof. Register your document today, 
              before it's lost. The certificate cannot be destroyed, altered, or taken away.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Security Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Cryptographically Secure</h3>
              <p className="text-slate-600 leading-relaxed">
                SHA-256 hashing ensures your document's fingerprint is unique and tamper-proof. 
                Any change to the document creates a completely different fingerprint.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Instant Processing</h3>
              <p className="text-slate-600 leading-relaxed">
                Everything happens in your browser. No waiting, no delays. 
                Your document is processed and protected in seconds.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Permanently Verifiable</h3>
              <p className="text-slate-600 leading-relaxed">
                Your certificate can be verified at any time by anyone. 
                The proof is permanent and accessible forever.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">
            Protect what matters most
          </h3>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Don't wait until it's too late. Register your property documents today 
            and ensure your family's future is secure.
          </p>
          <Link
            href="/upload"
            className="inline-block px-10 py-5 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-lg shadow-xl transition-all duration-200 text-xl hover:shadow-2xl hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </main>
  );
}
