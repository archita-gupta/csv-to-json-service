const express = require('express');
const router = express.Router();
const apiService = require('../services/api.service');


router.post('/', async (req, res) => {
  try {
      // if (!req.file) {
      //   return res.status(400).json({ error: 'Please upload a CSV file' });
      // }
      const result = await apiService.convertToJson(
        // req.file.buffer,
        // req.file.originalname,
      );
      if(result.status === 'success'){
        return res.status(200).json(result);
      }
      return res.status(400).json({ status: false, error: result.msg });
      
    } catch (error) {
      console.error('Error converting CSV:', error);
      res.status(500).json({ error: 'Error processing CSV file' });
    }
});


module.exports = router; 