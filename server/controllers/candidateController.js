const XLSX = require('xlsx');
const Candidate = require('../models/candidateModel');
const async = require('async');

const processExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const stats = { added: 0, skipped: 0 };

        await async.eachSeries(rows, async (record) => {
            try {
                if (!record.Email || !record['Name of the Candidate'] || !record['Mobile No.']) {
                    stats.skipped++;
                    console.warn(`Skipping record due to missing required fields: ${JSON.stringify(record)}`);
                    return;
                }

                const exists = await Candidate.findOne({ email: record.Email.toLowerCase() });
                if (exists) {
                    stats.skipped++;
                    return;
                }

                const candidateData = {
                    name: record['Name of the Candidate'].trim(),
                    email: record.Email.toLowerCase().trim(),
                    mobileNo: record['Mobile No.'].toString().trim(),
                    dob: record['Date of Birth'],
                    workExperience: record['Work Experience'],
                    resumeTitle: record['Resume Title'],
                    currentLocation: record['Current Location'],
                    postalAddress: record['Postal Address'],
                    currentEmployer: record['Current Employer'],
                    currentDesignation: record['Current Designation']
                };

                await Candidate.create(candidateData);
                stats.added++;
            } catch (error) {
                console.error(`Error processing record: ${JSON.stringify(record)}`, error);
                stats.skipped++;
            }
        });

        res.json({ message: 'File succesully uploaded', stats });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process file', details: err.message });
    }
};

module.exports = { processExcel };