import React, { useState } from 'react';
import axios from 'axios';
import './index.css';


const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setMessage('Only Excel files are allowed!');
        setFile(null);
      } else {
        setMessage('');
        setFile(selectedFile);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a valid Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Error processing file.');
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Upload Candidate Data
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Upload an Excel file with candidate information (.xls or .xlsx).
        </p>

        <div className="flex flex-col items-center mb-4">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handleFileUpload}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Upload File
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes('Error') || message.includes('Only')
                ? 'text-red-500'
                : 'text-green-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
