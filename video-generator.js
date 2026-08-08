/**
 * Advanced Creation Studio Video Generator
 * Using Google Generative AI Pro tier for 45-60 second video generation
 *
 * Setup:
 * 1. npm install @google/generative-ai
 * 2. Set GOOGLE_API_KEY environment variable
 * 3. Run: node video-generator.js
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('Error: GOOGLE_API_KEY environment variable not set');
  console.error('Set it via: export GOOGLE_API_KEY="your-key-here"');
  process.exit(1);
}

const client = new GoogleGenerativeAI(API_KEY);

/**
 * Generate a 45-60 second promotional video for Advanced Creation Studio
 */
async function generatePromotionalVideo() {
  try {
    console.log('🎬 Generating 45-60 second video for Advanced Creation Studio...\n');

    const model = client.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const prompt = `
Create a professional 45-60 second promotional video script and visual direction for Advanced Creation Studio.

Company: Advanced Creation Studio
Domain: advancedcreationstudio.com
Focus: Government-facing strategy and creative studio
Flagship Program: Recidivism Reduction & Reentry Support Program

Brand Colors: Navy (#0B1120), Blue (#1E90FF), White
Tone: Credible, Dignified, Strategic, Compassionate
Key Slogans: "Complete. Professional. Contract-Ready." | "Clear. Consistent. Confident."

Video Requirements:
- Duration: 45-60 seconds (10-15 scenes at ~4 seconds each)
- Target: Federal and state government agencies
- Format: Professional, modern, authoritative yet approachable
- Include: Logo, key services, flagship program, call-to-action

Provide:
1. Scene-by-scene breakdown (timing, visuals, audio)
2. Voiceover script (professional, conversational)
3. Music/sound design notes
4. Color palette application per scene
5. Text overlays and their timing
6. Call-to-action (contact/website)
7. Technical specs (resolution, frame rate, aspect ratio)
8. Production tips for in-house or agency creation

Format as structured JSON with all details.
    `;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8000,
      },
    });

    const videoScript = response.response.text();

    // Save output
    const outputPath = path.join(__dirname, 'video-script-pro.json');
    fs.writeFileSync(outputPath, videoScript, 'utf8');

    console.log('✅ Video script generated successfully!\n');
    console.log('📄 Output saved to: video-script-pro.json\n');
    console.log('─'.repeat(80));
    console.log(videoScript);
    console.log('─'.repeat(80));

    return videoScript;
  } catch (error) {
    console.error('❌ Error generating video:', error.message);
    process.exit(1);
  }
}

/**
 * Generate alternative video concepts (3 options)
 */
async function generateVideoConcepts() {
  try {
    console.log('\n🎨 Generating 3 alternative video concepts...\n');

    const model = client.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const concepts = [
      {
        name: 'Impact-Focused',
        prompt: `Generate a 45-60 second video concept for Advanced Creation Studio focusing on real impact:
        successful reentry stories, recidivism reduction outcomes, community transformation.
        Tone: Inspirational yet data-grounded. Format: Scene-by-scene breakdown with timing, visuals, audio cues.`,
      },
      {
        name: 'Brand Authority',
        prompt: `Generate a 45-60 second video concept for Advanced Creation Studio emphasizing premium authority:
        clean design, government credibility, process clarity, contract-ready precision.
        Tone: Professional, authoritative, confident. Format: Scene-by-scene breakdown.`,
      },
      {
        name: 'Explainer Style',
        prompt: `Generate a 45-60 second video concept for Advanced Creation Studio as an animated explainer:
        what we do, who we serve, flagship program overview, how to partner.
        Tone: Clear, modern, accessible. Include animation style notes and typography.`,
      },
    ];

    const results = [];

    for (const concept of concepts) {
      console.log(`⏳ Generating "${concept.name}" concept...`);

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: concept.prompt }] }],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          maxOutputTokens: 4000,
        },
      });

      results.push({
        concept: concept.name,
        content: response.response.text(),
      });
    }

    // Save all concepts
    const conceptsPath = path.join(__dirname, 'video-concepts.json');
    fs.writeFileSync(conceptsPath, JSON.stringify(results, null, 2), 'utf8');

    console.log('\n✅ All 3 concepts generated!\n');
    console.log('📄 Concepts saved to: video-concepts.json\n');

    results.forEach((result) => {
      console.log(`\n${'═'.repeat(80)}`);
      console.log(`📺 ${result.concept}`);
      console.log(`${'═'.repeat(80)}`);
      console.log(result.content);
    });

    return results;
  } catch (error) {
    console.error('❌ Error generating concepts:', error.message);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Advanced Creation Studio Video Generator (Pro Tier)   ║');
  console.log('║  Google Generative AI - 45-60 Second Videos            ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Generate main video script
  await generatePromotionalVideo();

  // Generate alternative concepts
  await generateVideoConcepts();

  console.log('\n✨ All video assets generated! Next steps:');
  console.log('   1. Review video-script-pro.json');
  console.log('   2. Review video-concepts.json for alternative ideas');
  console.log('   3. Use scripts to guide video production (in-house or agency)');
  console.log('   4. Export final video to advancedcreationstudio.com\n');
}

main().catch(console.error);
