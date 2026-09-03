const router = require('express').Router();
const Groq = require('groq-sdk');
const axios = require('axios');
const auth = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cleanResponse(text) {
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '')
  cleaned = cleaned.replace(/<think>[\s\S]*/gi, '')
  cleaned = cleaned.replace(/\*\*/g, '')
  cleaned = cleaned.replace(/```json|```/g, '')
  return cleaned.trim()
}

// AI description from IMAGE (physical product)
router.post('/describe-image', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log('Describing image:', imageUrl);

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.8-27b',        // ✅ updated vision model
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

// AI description from PDF/file (digital product)
router.post('/describe-file', auth, async (req, res) => {
  try {
    const { fileUrl, fileName, fileContent } = req.body

    if (!fileUrl) return res.status(400).json({ msg: 'No file URL provided' })

    // Use fileName from request or extract from URL
    const name = fileName || decodeURIComponent(
      fileUrl.split('/').pop().replace(/^\d+-/, '')
    )
    console.log('Filename:', name)
    console.log('File content length:', fileContent?.length || 0)

    // Build prompt using content sent from frontend
    const hasContent = fileContent && fileContent.trim().length > 50
    const cleanContent = hasContent
      ? fileContent.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800)
      : ''

    const prompt = hasContent
  ? `You are helping a college student sell their study notes on a marketplace. 
Read this content from the file named "${name}" and write a detailed, helpful product listing description.
Include: subject name, specific topics covered, which semester it is useful for, and why a student should buy it.
Write 3-4 sentences. Be specific. Do NOT be generic.

File content:
${cleanContent}`
  : `You are helping a college student sell their study notes on a marketplace.
The file is named "${name}".
Write a detailed product listing description mentioning the subject, likely topics covered, which semester it is useful for, and why a student should buy it.
Write 3-4 sentences. Be specific. Do NOT write generic descriptions.`

    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    })

    let description = cleanResponse(response.choices[0].message.content)

    if (!description || description.length < 10) {
      description = `Study notes for ${name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}. Useful for engineering students preparing for exams.`
    }

    console.log('Description:', description)
    console.log('File content received:', fileContent?.slice(0, 200))
    res.json({ description })

  } catch (err) {
    console.log('File AI error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router;