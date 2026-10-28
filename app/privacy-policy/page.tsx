// app/privacy-policy/page.tsx
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <Link href="/" className="text-blue-600 font-semibold hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: October 27, 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h2>
            <p>Welcome to BizQuery. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. The Data We Collect</h2>
            <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Identity Data</strong> includes username.</li>
              <li><strong>Contact Data</strong> includes email address.</li>
              <li><strong>Content Data</strong> includes the questions, answers, and articles you post on the platform.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, and time zone setting.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to create and manage your account, allow you to post and interact with content, and improve the security of our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Google AdSense & Cookies</h2>
            <p>We may use third-party advertising companies, such as Google AdSense, to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
            <p className="mt-2">Google uses cookies to serve ads based on your prior visits to this website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Account Deletion</h2>
            <p>
              If you wish to delete your account and all associated data, please contact us at{' '}
              <a href="mailto:bizquerysupport@gmail.com" className="text-blue-600 font-bold hover:underline">
                bizquerysupport@gmail.com
              </a>{' '}
              and we will process your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at:{' '}
              <a href="mailto:bizquerysupport@gmail.com" className="text-blue-600 font-bold hover:underline">
                bizquerysupport@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}