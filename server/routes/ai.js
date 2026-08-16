const router = require('express').Router();
const Groq = require('groq-sdk');
const axios = require('axios');
const auth = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cleanResponse(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}


router.post('/describe-image', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log('Describing image:', imageUrl);

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl } },
          { type: 'text', text: 'You are a helpful assistant for a college student marketplace. Look at this product image and write a short, honest, friendly listing description. Mention condition, what it is, and why a student would want it. Max 60 words. Give ONLY the description, no thinking, no explanation.' }
        ]
      }],
      max_tokens: 200,
    });

    const description = cleanResponse(response.choices[0].message.content);
    res.json({ description });

  } catch (err) {
    console.log('Image AI error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});


router.post('/describe-file', auth, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    console.log('Describing file:', fileUrl);

    if (!fileUrl) {
      return res.status(400).json({ msg: 'No file URL provided' });
    }

    const fileName = decodeURIComponent(fileUrl.split('/').pop().replace(/^\d+-/, ''));
    console.log('Filename:', fileName);

    let fileContent = '';
    try {
      const fileResponse = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
        timeout: 10000
      });
      const buffer = Buffer.from(fileResponse.data);
      const rawText = buffer.toString('utf-8', 0, 3000);
      fileContent = rawText
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1000);
      console.log('Extracted text length:', fileContent.length);
    } catch (downloadErr) {
      console.log('Could not download file:', downloadErr.message);
      fileContent = '';
    }

    const prompt = fileContent.length > 50
      ? `You are a helper for a college notes marketplace. Based on this study material content and filename "${fileName}", write a short listing description. Mention: subject name, topics covered, which semester or exam it is useful for. Max 80 words. Give ONLY the description, no thinking.\n\nContent preview: ${fileContent}`
      : `You are a helper for a college notes marketplace. Based on this filename "${fileName}", write a short listing description for college study material. Mention likely subject, topics, and which students would benefit. Max 80 words. Give ONLY the description, no thinking.`;

    const response = await groq.chat.completions.create({
      model: 'qwen-qwq-32b',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const description = cleanResponse(response.choices[0].message.content);
    console.log('Generated description:', description);
    res.json({ description });

  } catch (err) {
    console.log('File AI error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;