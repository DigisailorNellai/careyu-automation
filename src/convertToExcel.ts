import * as XLSX from 'xlsx';
import * as fs from 'fs';

// Sample JSON data
const jsonData = {
    "data": 
    
    [
        ["Customer Name:", null, null, "Customer Code:", null, null, "T", "Product Name: TM - A", null, null, "Product Code:"],
        ["Thickness", "Cutting Size", null, "Size", null, null, "Product Type", "Position", "Process", "Fold", "Hole", "Slot", "Die No", "Qty", "Colour"],
        [null, "L", "W", "L", "W", "Pipe"],
        [0.9, 1291, 472, 1235, 400, null, "Panels", "NA", "F2", "Single", 3, null, 1, 9, "CM Ivory"],
        [0.7, 395, 274, 375, 234, null, "Partition Plate", "C Type", "C1", "NA", "NA", null, "9,10,12", 12, "CM Ivory"],
        [0.7, 395, 294, 375, 254, null, "Partition Plate", "C Type", "C1", "NA", "NA", null, "9,10,12", 4, "CM Ivory"],
        [0.5, 2020, 385, null, null, null, "Covering Sheets", "Side", null, "NA", "NA", null, null, 2, "CM Ivory"],
        [0.5, 2020, 1220, null, null, null, "Covering Sheets", "Back", null, "NA", "NA", null, null, 1, "CM Ivory"],
        [1.8, null, null, 2150, null, null, "Angle", "NA", null, "NA", "NA", null, null, 4, "Deep Blue"],
        [null, null, null, "5/16", "5/8", null, "Rack Bold Nut", "NA", null, "NA", "NA", null, null, 48, "NA"],
        [null, null, null, 1, "1/2", null, "Bold Nut", "NA", null, "NA", "NA", null, null, 3, "NA"],
        [null, null, null, 40, 40, null, "Bush", "NA", null, "NA", "NA", null, null, 4, "NA"],
        [],
        []
    ]
};

// Convert JSON to worksheet
const ws = XLSX.utils.aoa_to_sheet(jsonData.data);

// Create a new workbook and append the worksheet
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// Write the workbook to a file
const filePath = './output.xlsx';
XLSX.writeFile(wb, filePath);

console.log(`Excel file created successfully at ${filePath}`);
