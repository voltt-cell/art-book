export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 mb-8">Terms of Service</h1>

                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p className="text-sm font-medium text-gray-400">Last updated: February 2026</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Acceptance of Terms</h2>
                    <p>By accessing and using ArtBook ("Platform", "we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">2. User Accounts</h2>
                    <p>You must be at least 18 years old to create an account. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Artwork Listed on ArtBook</h2>
                    <p>Artists retain full copyright of their original works. ArtBook acts solely as an intermediary venue for transactions between buyers and sellers. We do not take ownership of physical pieces at any point in the transaction lifecycle.</p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Auctions and Bidding</h2>
                    <p>Bids placed on ArtBook are legally binding. When you submit a bid, you are committing to purchase the item at that price if you are the winning bidder.</p>
                </div>
            </div>
        </div>
    );
}
