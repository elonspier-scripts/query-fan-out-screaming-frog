# 🚀 Screaming Frog Gemini AI: Query Fan-Out Analyzer (v2026.3)

## 🌟 De Oplossing

Dit script analyseert jouw pagina's om de zichtbaarheid in AI-zoekmachines (zoals Google Search Generative Experience / AI Overviews) te maximaliseren. Het script automatiseert de volgende taken:

* 🎯 **Identificeer je primaire entiteit**: Ontdek wat de AI als het werkelijke hoofdonderwerp van de pagina ziet.
* 🔍 **Voorspel 8-10 sub-queries**: Anticipeer op de vragen die Google's AI genereert (Fan-out) om een antwoord te synthetiseren.
* 📊 **Scoor je content-dekking**: Directe feedback of je pagina de vragen beantwoordt (Ja/Gedeeltelijk/Nee).
* 💡 **Vul content-gaten**: Ontvang concrete aanbevelingen voor ontbrekende informatie.
* 🔮 **Voorspel vervolgvragen**: Anticipeer op de logische volgende stap in de klantreis.

---

## 📋 Vereisten

* **Screaming Frog SEO Spider**: Elke versie met ondersteuning voor Custom JavaScript columns.
* **Google Gemini API Key**: Een gratis of betaalde sleutel via [Google AI Studio](https://aistudio.google.com/).
* **JavaScript Rendering**: Moet ingeschakeld zijn in de spider-instellingen.
* **Basiskennis van JavaScript**: Optioneel (het script is direct klaar voor gebruik).

---

## 🎯 Gebruik (Usage)

1.  **Start een crawl** in Screaming Frog met het script geactiveerd.
2.  **Navigeer naar het tabblad** van de opgeslagen Custom JS kolom (bijv. "AI Fan-Out").
3.  **Review de resultaten** direct in de interface tijdens of na de crawl.
4.  **Exporteer resultaten** naar CSV/Excel voor bulk-analyse en prioritisering.

---

## 📖 Wat doet dit script technisch?

1.  **Layout-Aware Chunking**: Het script analyseert de HTML-structuur (H1-H3, lijsten en Schema.org) om de tekst semantisch op te breken.
2.  **Entiteit Identificatie**: Bepaalt de belangrijkste ontologische entiteit op basis van de gevonden chunks.
3.  **AI Reasoning**: Gebruikt Gemini 3.1 om sub-vragen te genereren (gerelateerd, impliciet, vergelijkend of procedureel).
4.  **Gap Analysis**: Vergelijkt de voorspelde vragen met de aanwezige tekst-chunks voor een dekkingsscore.

---

## 🛠 Installatie & Setup

### 1. API Key Configuratie
Vervang in de eerste regels van het script `'API_KEY'` door jouw persoonlijke sleutel uit AI Studio.

### 2. Screaming Frog Optimalisatie
Voor een stabiele bulk-crawl zijn de volgende instellingen vereist:

* **Rendering**: `Configuration > Spider > Rendering` -> **JavaScript**.
* **AJAX Timeout**: Verhoog naar **60 seconden** (AI-modellen hebben denktijd nodig).
* **Snelheid**: `Configuration > Speed`.
    * **Max Threads**: **1** (Essentieel om rate-limits te voorkomen).
    * **Max Requests Per Second**: **0.2** (Dit komt neer op 1 verzoek per 5 seconden).

---

## 🧐 De Output Begrijpen (Understanding the Output)

In de Screaming Frog kolom zie je per URL een rapportage zoals dit:

```text
=== GOOGLE AI MODE QUERY FAN-OUT ANALYSIS ===

PRIMARY ENTITY: Duurzame E-commerce Marketing

FAN-OUT QUERIES:
• Wat maakt marketing duurzaam voor webshops? - Coverage: Partial
• Hoeveel budget hebben kleine e-commerce bedrijven nodig? - Coverage: No
• Welke eco-vriendelijke marketingkanalen hebben de beste ROI? - Coverage: Yes
...

COVERAGE SCORE: 3/10 queries covered
RECOMMENDATIONS: Voeg budgetrichtlijnen toe voor het MKB, voeg case studies toe van groene ROI.
```

### 📈 Interpretatie van de Dekkingsscores (Coverage Scores)

* **0-3/10: Kritieke hiaten** – Grote kansen voor nieuwe content.
* **4-6/10: Gemiddeld** – Basis aanwezig, maar belangrijke sub-onderwerpen ontbreken.
* **7-8/10: Goed** – De pagina is zeer compleet. Alleen kleine optimalisaties nodig.
* **9-10/10: Uitstekend** – Volledige dekking. Sterke kandidaat voor AI Overviews.

### ⚠️ Probleemoplossing: Error Codes Begrijpen

| Error Code | Betekenis | Oplossing |
| :--- | :--- | :--- |
| **429: Too Many Requests** | Je gaat sneller dan de toegestane 15 RPM. | Zet Max Threads op 1 en snelheid naar 0.2. |
| **503: Service Unavailable** | Google's servers zijn overbelast. | Script probeert het automatisch opnieuw via retry-logic. |
| **Timeout Expired** | Spider wachtte niet lang genoeg op de AI. | Verhoog AJAX Timeout naar 60 seconden. |

> [!IMPORTANT]
> **Belangrijke limieten: API Rate Limiting (15 RPM)**
> De gratis tier van de Gemini API hanteert een limiet van 15 Requests Per Minute (RPM). Om een crash van je crawl te voorkomen, moet je de snelheid in Screaming Frog handmatig begrenzen op 1 thread en 0.2 requests per seconde.

### 📊 Geavanceerd Gebruik

**Bulk Analyse**
Crawl je volledige sitemap en sorteer op Dekkingsscore. Focus je redactie eerst op pagina's met een score lager dan 4.

**Concurrentieanalyse**
Crawl URL's van concurrenten om hun "content gaps" te vinden die jij kunt exploiteren. Vergelijk de scores om te zien waar jij een autoriteitsvoorsprong kunt pakken.

**Contentstrategie & Topic Clusters**
Gebruik de voorspelde fan-out queries om:
* Nieuwe H2/H3 koppen te schrijven.
* FAQ-secties met Schema.org data te bouwen.
* Ondersteunende artikelen te creëren voor "Nee/Gedeeltelijk" gescoorde vragen.

## ⚙️ Geavanceerde Instellingen (generationConfig)

Het wordt **geadviseerd om de huidige settings zo te houden** voor een optimale balans tussen nauwkeurigheid en bruikbaarheid:

* **Temperature (0.1 - 0.3):** Houd dit laag voor feitelijke, consistente SEO-audits.
* **Top-K (20-40):** Beperkt de woordkeuze voor scherpere resultaten.
* **Top-P (0.9 - 0.95):** Balans tussen logica en variatie (Nucleus Sampling).

**Meer uitleg over modelparameters:**
[IBM Documentatie: Model parameters voor prompting](https://www.ibm.com/docs/en/watsonx/saas?topic=prompts-model-parameters-prompting)

### 💎 Upgraden naar Gemini 3.1 Pro

Vervang `modelId` door `gemini-3.1-pro-preview` in het script voor:
* **Diepere Analyse:** Beter begrip van complexe B2B of technische teksten.
* **Hogere Redeneerkracht:** Accuradere voorspellingen van impliciete vragen.
* **Creatievere Output:** Minder repetitieve suggesties voor content-optimalisatie.

### 📈 Performance Tips

* **Begin Klein:** Test eerst op 10-20 pagina's.
* **Gebruik Filters:** Sluit pagina's zonder inhoud (tags, archieven) uit.
* **Cache Resultaten:** Exporteer en track veranderingen over tijd.

### 📜 Licentie

MIT License - Vrij te gebruiken voor SEO-professionals.
