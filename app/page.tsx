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
            <p className="text-xl sm:text-2xl text-slate-700 mb-6 leading-relaxed">
              When disasters strike, when documents are lost to fire or flood, when corruption 
              threatens your family's future — your proof of ownership shouldn't disappear with it.
            </p>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              EXTATE creates a tamper-proof digital certificate that proves your document existed 
              and hasn't been altered. It's permanent, verifiable proof that can't be destroyed, 
              disputed, or taken away.
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

      {/* Trust & Security Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Cryptographically Secure</h3>
              <p className="text-slate-600 leading-relaxed">
                SHA-256 hashing ensures your document's fingerprint is unique and tamper-proof. 
                Any change to the document creates a completely different fingerprint.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Instant Processing</h3>
              <p className="text-slate-600 leading-relaxed">
                Everything happens in your browser. No waiting, no delays. 
                Your document is processed and protected in seconds.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="text-5xl mb-4">✓</div>
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
