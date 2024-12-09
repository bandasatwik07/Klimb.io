const XLSX = require('xlsx');
const Candidate = require('../models/candidateModel');
const async = require('async');

const processExcel = async (req, res) => {
    try {
        // Ensure the file is provided
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Parse Excel file from the buffer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const records = XLSX.utils.sheet_to_json(sheet);

        const results = { success: 0, skipped: 0 };

        // Process records using async.eachSeries
        await async.eachSeries(records, async (record) => {
            try {
                const existing = await Candidate.findOne({ email: record.Email });

                if (existing) {
                    results.skipped++;
                    return; // Skip duplicate records
                }

                // Store all properties dynamically
                const candidateData = {};
                for (const [key, value] of Object.entries(record)) {
                    candidateData[key] = typeof value === 'string' ? value.trim() : value;
                }

                await Candidate.create(candidateData);
                results.success++;
            } catch (error) {
                console.error(`Error processing record: ${JSON.stringify(record)}`, error);
                throw error;
            }
        });

        res.json({ message: 'File processed successfully', results });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process file', details: err.message });
    }
};

module.exports = { processExcel };
