// components/SearchInput.tsx

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
    return (
        <div className="relative w-full max-w-xs">
            <input
                type="text"
                placeholder="Tìm kiếm từ khóa..."
                className="border p-2 pl-10 w-full rounded-lg"
                value={value}
                onChange={onChange}
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
    );
};

export default SearchInput;
