const router = require('express').Router();
const Groq = require('groq-sdk');
const axios = require('axios');
const auth = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI description from IMAGE
router.post('/describe-image', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log('Describing image:', imageUrl);

    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl } },
          { type: 'text', text: 'You are a helpful assistant for a college student marketplace. Look at this product image and write a short, honest, friendly listing description. Mention condition, what it is, and why a student would want it. Max 60 words.' }
        ]
      }],
      max_tokens: 200,
    });

    res.json({ description: response.choices[0].message.content });
  } catch (err) {
    console.log('Image AI error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

// AI description from PDF — no parsing library needed
router.post('/describe-file', auth, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    console.log('Describing file:', fileUrl);

    if (!fileUrl) {
      return res.status(400).json({ msg: 'No file URL provided' });
    }

    // Get filename from URL to use as context
    const fileName = decodeURIComponent(fileUrl.split('/').pop().replace(/^\d+-/, ''));
    console.log('Filename:', fileName);

    // Try to download and read the file as text
    let fileContent = '';
    try {
      const fileResponse = await axios.get(fileUrl, { 
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      // Try to extract readable text from buffer
      const buffer = Buffer.from(fileResponse.data);
      const rawText = buffer.toString('utf-8', 0, 3000);
      
      // Extract only readable ASCII characters
      fileContent = rawText
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1000);
        
      console.log('Extracted text length:', fileContent.length);
    } catch (downloadErr) {
      console.log('Could not download file, using filename only:', downloadErr.message);
      fileContent = '';
    }

    // Build prompt — use file content if available, otherwise use filename
    const prompt = fileContent.length > 50
      ? `You are a helper for a college notes marketplace. Based on this study material content and filename "${fileName}", write a short listing description. Mention: subject name, topics covered, which semester or exam it is useful for. Max 80 words.\n\nContent preview: ${fileContent}`
      : `You are a helper for a college notes marketplace. Based on this filename "${fileName}", write a short listing description for college study material. Mention likely subject, topics, and which students would benefit. Max 80 words.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const description = response.choices[0].message.content;
    console.log('Generated description:', description);
    res.json({ description });

  } catch (err) {
    console.log('File AI error:', err.message);
    console.log('Full error:', err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;