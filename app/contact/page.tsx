// app/contact/page.tsx
import Link from 'next/link';

export default function Contact() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <Link href="/" className="text-blue-600 font-semibold hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Contact Us</h1>

        <div className="space-y-6 text-gray-700">
          <p className="text-lg">
            We are here to help! Whether you have a question about the platform, need to report a user, or wish to delete your account, please reach out to us.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="font-bold text-gray-800 mb-2">Email Support:</p>
            
            {/* ✅ Made the email clickable */}
            <a 
              href="mailto:bizquerysupport@gmail.com" 
              className="text-xl text-blue-600 font-bold mb-4 hover:underline inline-block transition-colors"
            >
              bizquerysupport@gmail.com
            </a>
            
            <p className="text-sm text-gray-500">We aim to respond to all inquiries within 24-48 hours.</p>
          </div>
        </div>
      </div>
    </main>
  );
}