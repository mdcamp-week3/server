import axios from 'axios';

export const uploadImage = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    const fileFormat = req.file.mimetype.split('/')[1]; 

    const requestBody = {
      version: "V2",
      requestId: Date.now().toString(),
      timestamp: Date.now(),
      images: [
        {
          name: "upload",
          format: fileFormat,
          data: base64Image,
        },
      ],
    };

    const response = await axios.post(
      process.env.CLOVA_OCR_INVOKE_URL, 
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-OCR-SECRET': process.env.CLOVA_OCR_SECRET,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('❌ OCR 처리 실패:', err.response?.data || err.message);
    res.status(500).json({
      error: 'OCR 실패',
      detail: err.response?.data || err.message,
    });
  }
};
