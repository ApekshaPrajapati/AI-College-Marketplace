const router = require('express').Router();
const Groq = require('groq-sdk');
const axios = require('axios');
const auth = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cleanResponse(text) {
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '')
  cleaned = cleaned.replace(/<think>[\s\S]*/gi, '')
  cleaned = cleaned.replace(/\*\*/g, '')
  return cleaned.trim()
}

// AI description from IMAGE
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
          { type: 'text', text: 'You are a helpful assistant for a college student marketplace. Write a short product listing description for this image. Max 60 words. Give ONLY the final description, nothing else.' }
        ]
      }],
      max_tokens: 200,
      reasoning_effort: 'none',
    });

    const description = cleanResponse(response.choices[0].message.content);
    res.json({ description });

  } catch (err) {
    console.log('Image AI error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

// AI description from PDF/file
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
    } catch (downloadErr) {
      console.log('Could not download file:', downloadErr.message);
      fileContent = '';
    }

    const prompt = fileContent.length > 50
      ? `Write a short college notes marketplace listing for filename "${fileName}". Mention subject, topics, semester. Max 80 words. Only the description.\n\nContent: ${fileContent}`
      : `Write a short college notes marketplace listing for filename "${fileName}". Mention subject, topics, semester. Max 80 words. Only the description.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const description = cleanResponse(response.choices[0].message.content);
    res.json({ description });

  } catch (err) {
    console.log('File AI error:', err.message);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;