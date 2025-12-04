// components/ExportToExcel.jsx
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportToExcel = ({ data, fileName, headers }) => {
    const handleExport = () => {
        let exportData = data;

        
        if (headers && headers.length > 0) {
            exportData = data.map(item => {
                const newItem = {};
                headers.forEach(({ key, label }) => {
                    newItem[label] = item[key];
                });
                return newItem;
            });
        }

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = {
            Sheets: { Data: worksheet },
            SheetNames: ['Data'],
        };
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        >
            📥 Xuất file Excel
        </button>
    );
};

export default ExportToExcel;
