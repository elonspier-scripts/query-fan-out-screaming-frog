/**
 * Gemini AI Query Fan-Out Detection for Screaming Frog
 * Model: gemini-3.1-flash-lite-preview (March 2026)
 * * IMPORTANT: Set "Max Threads" to 1 in Configuration > System > User Interface.
 * Set "Limit Max Requests Per Second" to 0.2 in Configuration > Speed.
 */

// 1. SETTINGS - Replace with your NEW API Key from AI Studio
const apiKey = 'AIzaSyBoHiYy_N6mGNZ0hom97FARhfveEovg0YM'; 
const modelId = 'gemini-3.1-flash-lite-preview';

// 2. Extract semantic chunks from page (Your Original Layout-Aware Logic)
function extractSemanticChunks() {
  const chunks = [];
  
  // Extract title and main heading
  const title = document.title || '';
  const h1 = document.querySelector('h1')?.textContent || '';
  if (title || h1) {
    chunks.push({
      type: 'primary_topic',
      content: `${title} ${h1}`.trim()
    });
  }
  
  // Extract headings and their content
  const headings = document.querySelectorAll('h2, h3');
  headings.forEach(heading => {
    let content = heading.textContent;
    let sibling = heading.nextElementSibling;
    let sectionContent = '';
    
    while (sibling && !['H1', 'H2', 'H3'].includes(sibling.tagName)) {
      if (sibling.textContent) {
        sectionContent += ' ' + sibling.textContent;
      }
      sibling = sibling.nextElementSibling;
    }
    
    if (sectionContent.trim()) {
      chunks.push({
        type: 'section',
        heading: content,
        content: sectionContent.trim().substring(0, 500)
      });
    }
  });
  
  // Extract key lists and FAQs
  document.querySelectorAll('ul, ol').forEach((list, idx) => {
    if (idx < 5 && list.children.length > 2) {
      chunks.push({
        type: 'list',
        content: Array.from(list.children).map(li => li.textContent).join(' | ').substring(0, 300)
      });
    }
  });
  
  // Extract schema.org data
  const schemas = document.querySelectorAll('script[type="application/ld+json"]');
  schemas.forEach(schema => {
    try {
      const data = JSON.parse(schema.textContent);
      if (data['@type']) {
        chunks.push({
          type: 'structured_data',
          content: `Type: ${data['@type']}, ${JSON.stringify(data).substring(0, 200)}`
        });
      }
    } catch (e) {}
  });
  
  return chunks;
}

// 3. Analysis Orchestrator
async function runAIAnalysis() {
  try {
    const url = window.location.href;
    const chunks = extractSemanticChunks();
    
    // Construct System-style Prompt
    const prompt = `You are analyzing a webpage for Google's AI Mode query fan-out potential. Google's AI Mode decomposes user queries into multiple sub-queries to synthesize comprehensive answers.

URL: ${url}

SEMANTIC CHUNKS FROM PAGE:
${JSON.stringify(chunks, null, 2)}

Voer op basis van deze inhoud de volgende analyse uit:

1. IDENTIFICEER PRIMAIRE ENTITEIT: Wat is de belangrijkste ontologische entiteit of het onderwerp van deze pagina?

2. VOORSPEEL 'FAN-OUT' ZOEKOPDRACHTEN: Genereer 8-10 waarschijnlijke sub-vragen die Google's AI zou kunnen maken wanneer een gebruiker naar dit onderwerp vraagt. Denk aan:
   - Gerelateerde vragen (bredere context)
   - Impliciete vragen (onuitgesproken behoeften)
   - Vergelijkende vragen (alternatieven, vergelijkingen)
   - Procedurele vragen (hoe-te-aspecten)
   - Contextuele verfijningen (budget, omvang, locatie)

3. SEMANTISCHE DEKKINGSSCORE: Beoordeel voor elke voorspelde zoekopdracht of de pagina informatie biedt om deze te beantwoorden (Ja/Gedeeltelijk/Nee).

4. POTENTIËLE VERVOLGVRAGEN: Welke vervolgvragen zouden gebruikers waarschijnlijk stellen na het lezen van deze inhoud?

OUTPUT FORMAT (IN HET NEDERLANDS):
PRIMAIRE ENTITEIT: [naam entiteit]

FAN-OUT ZOEKOPDRACHTEN:
• [Zoekopdracht 1] - Dekking: [Ja/Gedeeltelijk/Nee]
• [Zoekopdracht 2] - Dekking: [Ja/Gedeeltelijk/Nee]
...

VERVOLGPOTENTIEEL:
• [Vervolgvraag 1]
• [Vervolgvraag 2]
...

DEKKINGSSCORE: [X/10 zoekopdrachten gedekt]
AANBEVELINGEN: [Specifieke gaten in de content om te vullen]`;

    // 4. API Request with Retry Logic (Handles 503 Spikes)
    const maxRetries = 3;
    let delayTime = 2000; // Starting at 2 seconds

    for (let i = 0; i < maxRetries; i++) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048
          }
        })
      });

      // If overloaded (503) or rate-limited (429), wait and retry
      if (response.status === 503 || response.status === 429) {
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayTime));
          delayTime *= 2; // Exponential backoff
          continue;
        }
      }

      const responseData = await response.json();

      if (response.ok && responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
        let aiResult = responseData.candidates[0].content.parts[0].text;
        
        // Final Output Formatting
        let finalOutput = '=== GOOGLE AI MODE QUERY FAN-OUT ANALYSIS ===\n\n';
        finalOutput += aiResult;
        finalOutput += '\n\n=== CONTENT CHUNKING SUMMARY ===\n';
        finalOutput += `• Primary Topic Chunks: ${chunks.filter(c => c.type === 'primary_topic').length}\n`;
        finalOutput += `• Section Chunks: ${chunks.filter(c => c.type === 'section').length}\n`;
        finalOutput += `• List/FAQ Chunks: ${chunks.filter(c => c.type === 'list').length}\n`;
        finalOutput += `• Structured Data: ${chunks.filter(c => c.type === 'structured_data').length > 0 ? 'Yes' : 'No'}\n`;
        finalOutput += `• Total Semantic Chunks: ${chunks.length}`;

        return seoSpider.data(finalOutput);
      } else {
        const errorMsg = responseData.error ? responseData.error.message : 'Unknown API Error';
        return seoSpider.error(`API ${response.status}: ${errorMsg}`);
      }
    }
  } catch (error) {
    return seoSpider.error(`Script Error: ${error.toString()}`);
  }
}

// 5. Trigger
return runAIAnalysis();