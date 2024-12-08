const XLSX = require('xlsx');

const parseExcel = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
};

module.exports = { parseExcel };
