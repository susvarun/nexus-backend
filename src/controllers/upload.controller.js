const FormData = require('form-data');
const fetch = require('node-fetch');

// @route   POST /api/upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const apiKey = process.env.FREEIMAGE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Freeimage API key is not configured' });
    }

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('action', 'upload');
    formData.append('source', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('format', 'json');

    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.status_code === 200) {
      res.json({ url: data.image.url });
    } else {
      res.status(400).json({ message: data.error?.message || 'Failed to upload image to Freeimage' });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};
