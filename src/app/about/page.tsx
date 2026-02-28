export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="font-serif text-5xl font-bold tracking-tight text-gray-900">About ArtBook</h1>

                <div className="prose prose-lg text-gray-600">
                    <p className="text-xl text-gray-800 font-medium">
                        ArtBook is a premier digital gallery connecting world-class artists directly with passionate collectors.
                    </p>

                    <p>
                        Founded with the belief that art should be accessible without sacrificing premium curation, we built a marketplace that empowers artists to showcase their work in a dedicated, beautiful environment. We strip away the noise of traditional social media and focus purely on the art and the artist's vision.
                    </p>

                    <h2 className="font-serif text-3xl font-semibold text-gray-900 mt-12 mb-6">Our Mission</h2>
                    <p>
                        To democratize fine art collection while maintaining an exclusive, highly-curated standard that respects the creator's effort and the collector's investment.
                    </p>
                </div>
            </div>
        </div>
    );
}
