const BASE_URL = "http://127.0.0.1:8000";

export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/upload-csv`, {
        method: "POST",
        body: formData,
    });
    
    if (!response.ok) throw new Error("Upload failed");
    return await response.json();
};

export const runQC = async (transcript, guidelines) => {
    const response = await fetch(`${BASE_URL}/run-qc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, guidelines }),
    });
    
    return await response.json();
};