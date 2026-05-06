import React from 'react';
import { uploadCSV } from "../../api.js";

export default function UploadButton({ onUploadSuccess }) {
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // This calls the function from your api.js file
            const data = await uploadCSV(file);
            console.log("Upload successful", data);
            onUploadSuccess(data); 
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <div className="p-4">
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
        </div>
    );
}