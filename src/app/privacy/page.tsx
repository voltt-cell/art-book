export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p className="text-sm font-medium text-gray-400">Last updated: February 2026</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when you create an account, update your profile, list artwork, place a bid, or communicate with us. This may include your name, email address, physical address, and payment information (processed securely through Stripe).</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">2. How We Use Your Information</h2>
                    <p>We use the information we collect to operate our platform, process transactions, communicate with you regarding your orders or bids, and to personalize your experience on ArtBook.</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Information Sharing</h2>
                    <p>We do not sell your personal data. We share necessary shipping information (name, address) between the artist and the buyer solely for the purpose of fulfilling an order.</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                </div>
            </div>
        </div>
    );
}
