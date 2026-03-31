# 🚀 Screaming Frog Gemini AI: Query Fan-Out Analyzer

Dit script is ontworpen voor gebruik binnen de **Screaming Frog SEO Spider** (Custom JavaScript Column). Het maakt gebruik van de **Gemini 3.1 Flash-Lite API** om webpagina's semantisch te analyseren en te voorspellen hoe Google's AI (Search Generative Experience) een zoekopdracht zou "uitwaaieren" (fan-out) in sub-vragen.

## 📖 Wat doet dit script?

1. **Layout-Aware Chunking**: Extraheert tekst in logische "chunks" op basis van de HTML-structuur (Titels, H1-H3, Lijsten en Schema.org).
2. **Entiteit Identificatie**: Bepaalt de belangrijkste ontologische entiteit van de pagina.
3. **Fan-Out Voorspelling**: Genereert 8-10 sub-vragen die een AI-model waarschijnlijk zou stellen bij dit onderwerp.
4. **Content Gap Analyse**: Scoort de huidige dekkingsgraad en geeft concrete verbeterpunten.

## 🛠 Installatie & Setup

### 1. API Key Verkrijgen
* Ga naar [Google AI Studio](https://aistudio.google.com/).
* Genereer een nieuwe API-sleutel voor het model `gemini-3.1-flash-lite-preview`.

### 2. Screaming Frog Configureren
* **Mode**: Spider mode.
* **Rendering**: `Configuration > Spider > Rendering` -> **JavaScript**.
* **AJAX Timeout**: Minimaal **30 of 60 seconden**.
* **Snelheid**: `Configuration > Speed`.
    * **Max Threads**: `1`
    * **Max Requests Per Second**: `0.2` (1 verzoek per 5 sec).

### 3. Script Toevoegen
1. Ga naar `Configuration > Custom > Custom JavaScript`.
2. Klik op **Add** en plak de code uit dit project.
3. Vervang `'API_KEY'` door jouw unieke sleutel.

## ⚙️ Configuratie
Pas de volgende variabelen aan bovenin het script:
- `apiKey`: Jouw Gemini Key.
- `targetLanguage`: De taal van de output (bijv. 'Dutch').

## 📜 Licentie
MIT License - Vrij te gebruiken en aan te passen.
