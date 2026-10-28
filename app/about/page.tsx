// app/about/page.tsx
import Link from 'next/link';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <Link href="/" className="text-blue-600 font-semibold hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">About BizQuery</h1>

        <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
          <p>
            Welcome to <strong>BizQuery</strong>, the premier platform dedicated to empowering entrepreneurs, business owners, and professionals.
          </p>
          <p>
            Based in <strong>Nigeria</strong> and built for a global audience, our primary goal is to facilitate the strategic growth of startup businesses. We believe that access to the right information and community support is the cornerstone of any successful venture.
          </p>
          <p>
            BizQuery serves as an interactive knowledge hub where individuals can ask business-related questions, share their expertise, and access high-quality, expert-written articles. Whether you are navigating the complexities of startup funding, looking for marketing strategies, or seeking legal advice, our community is here to provide actionable insights.
          </p>
          <p>
            We are committed to creating a professional, respectful, and highly informative environment where businesses can thrive together.
          </p>
        </div>
      </div>
    </main>
  );
}