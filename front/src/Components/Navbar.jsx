import React, { useState } from "react";

export default function Navbar({ setName }) {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        setName(inputValue);
    };

    return (
        <div className="flex justify-between items-center p-4 drop-shadow-md text-2xl">
            <div className="max-w-md mx-auto w-full">
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <input
                            type="search" id="search-input"
                            className="block w-full p-4 pl-10 text-sm text-white border active:bg-black border-gray-300 rounded-full bg-black focus:ring-0 focus:border-gray-600"
                            placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-gray-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
