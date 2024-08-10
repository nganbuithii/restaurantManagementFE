// components/SortSelect.tsx

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Chọn chủ đề" className="text-gray-700" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                <SelectItem value="light" className="p-2 hover:bg-gray-100">Light</SelectItem>
                <SelectItem value="dark" className="p-2 hover:bg-gray-100">Dark</SelectItem>
                <SelectItem value="system" className="p-2 hover:bg-gray-100">System</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default SortSelect;
