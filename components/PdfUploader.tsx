"use client"; // Add this line at the top

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export interface PdfUploaderRef {
  triggerFileInput: () => void;
}

const PdfUploader = forwardRef<PdfUploaderRef>((props, ref) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>(''); // State variable for file name
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
        triggerFileInput: () => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }
    }));

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            setNumPages(pdfDoc.getPageCount());
            setPdfFile(file);
            setFileName(file.name); // Update file name state
        }
    };

    const handleDownload = () => {
        if (pdfFile) {
            saveAs(pdfFile, pdfFile.name);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="application/pdf"
                id="fileInput"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {fileName && <p>Selected file: {fileName}</p>} {/* Display file name */}
            {numPages !== null && (
                <div>
                    <p>Number of pages: {numPages}</p>
                    <button onClick={handleDownload}>Download PDF</button>
                </div>
            )}
        </div>
    );
});

export default PdfUploader;