export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://econotes.moinul4u.com/#website",
                "url": "https://econotes.moinul4u.com",
                "name": "EcoNotes",
                "description": "Intelligent AI Audio Transcription & Note Taking",
                "potentialAction": [
                    {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": "https://econotes.moinul4u.com/search?q={search_term_string}"
                        },
                        "query-input": "required name=search_term_string"
                    }
                ],
                "inLanguage": "en-US"
            },
            {
                "@type": "Organization",
                "@id": "https://econotes.moinul4u.com/#organization",
                "name": "EcoNotes",
                "url": "https://econotes.moinul4u.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://econotes.moinul4u.com/logo.png" // Ensure you have a logo file
                },
                "sameAs": [
                    "https://twitter.com/econotes",
                    "https://facebook.com/econotes",
                    "https://linkedin.com/company/econotes"
                ]
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
