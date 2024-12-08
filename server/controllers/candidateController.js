const XLSX = require('xlsx');
const Candidate = require('../models/candidateModel');

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

        // Loop through each record and insert into database
        for (const record of records) {
            const existing = await Candidate.findOne({ email: record.Email });

            if (existing) {
                results.skipped++;
                continue; // Skip duplicate records
            }

            await Candidate.create({
                name: record['Name of the Candidate'],
                email: record.Email,
                mobileNo: record['Mobile No.'],
                dob: record['Date of Birth'],
                workExperience: record['Work Experience'],
                resumeTitle: record['Resume Title'],
                currentLocation: record['Current Location'],
                postalAddress: record['Postal Address'],
                currentEmployer: record['Current Employer'],
                currentDesignation: record['Current Designation'],
            });
            results.success++;
        }

        res.json({ message: 'File processed successfully', results });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process file', details: err.message });
    }
};

module.exports = { processExcel };
