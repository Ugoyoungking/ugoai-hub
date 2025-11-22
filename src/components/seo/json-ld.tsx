
export function JsonLd() {
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://ugoai-hub.vercel.app/#organization",
          "name": "UGO AI Studio",
          "url": "https://ugoai-hub.vercel.app/",
          "logo": "https://image2url.com/images/1763838272156-fa2c419c-4468-4ac7-95a3-7ca4c66adbe0.png",
          "description": "UGO AI Studio is an advanced all-in-one AI platform offering autonomous AI agents, workflow automation, AI app generation, website builders, knowledge-base AI training, and video generation. Built by web developer and designer Ugochukwu Jonathan.",
          "founder": {
            "@id": "https://ugoyoungking.github.io/portfolio/#person"
          },
          "sameAs": [
            "https://github.com/Ugoyoungking",
            "https://linkedin.com/in/ugochukwu-jonathan067"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "support",
            "email": "ugochukwujonathan067@gmail.com",
            "availableLanguage": ["English"]
          }
        },
        {
          "@type": "Person",
          "@id": "https://ugoyoungking.github.io/portfolio/#person",
          "name": "Ugochukwu Jonathan",
          "alternateName": "Ugoyoungking",
          "jobTitle": "Web Developer & Graphic Designer",
          "url": "https://ugoyoungking.github.io/portfolio/",
          "image": "https://image2url.com/images/1760142087082-0d9360e4-2d41-4459-a0a1-135afa56a7f7.jpg",
          "sameAs": [
            "https://github.com/Ugoyoungking",
            "https://linkedin.com/in/ugochukwu-jonathan067",
            "https://www.facebook.com/share/1BCG5qD7mM/?mibextid=wwXIfr",
            "https://www.truelancer.com/freelancer/tlusera2eae11",
            "https://wa.me/2349127714886",
            "https://www.wikidata.org/wiki/Q136481438"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Rivers State",
            "addressCountry": "Nigeria"
          },
          "worksFor": {
            "@id": "https://ugoai-hub.vercel.app/#organization"
          },
          "knowsAbout": [
            "AI Development",
            "Web Development",
            "React",
            "Node.js",
            "UI/UX",
            "Graphic Design"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://ugoai-hub.vercel.app/#website",
          "name": "UGO AI Studio",
          "url": "https://ugoai-hub.vercel.app/",
          "publisher": {
            "@id": "https://ugoai-hub.vercel.app/#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.google.com/search?q={search_term_string}+site:ugoai-hub.vercel.app",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "OfferCatalog",
          "@id": "https://ugoai-hub.vercel.app/#catalog",
          "name": "UGO AI Studio Tools & Services",
          "url": "https://ugoai-hub.vercel.app/",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Autonomous Agents",
                "description": "Smart multi-action agents capable of planning, reasoning, automating workflows, and executing tasks."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Workflow Builder",
                "description": "Drag-and-drop AI automation builder for creating advanced autonomous workflows."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI App Generator",
                "description": "Automatically creates full-stack applications using natural language instructions."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Website Builder",
                "description": "Effortlessly generate websites, landing pages, and UI layouts using AI."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Video Generator",
                "description": "Generate video content using AI-powered rendering and media automation."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Knowledge Base AI Training",
                "description": "Upload documents, URLs, or datasets to train a personalized AI chatbot or assistant."
              }
            }
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
