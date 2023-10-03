import React, { useState, useEffect } from "react";


const SearchDropdown = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const NOTION_API_KEY = "secret_k15S4LDFByNsY7qwUgaBJa5Z15GQUie5nec5nMz1v9R";
  const notion = new Client({ auth: NOTION_API_KEY });

  useEffect(() => {
  const PAGE_ID = "36ac16834fda492eaa0004693609b0d9";
    const fetchSearchResults = async () => {
      (async () => {
        const pageId = PAGE_ID;
        const response = await notion.pages.retrieve({ page_id: pageId });
        console.log(response);
      })();
      
    };
    fetchSearchResults();
  }, [searchValue]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search Notion pages..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <ul>
        {searchResults.map((result) => (
          <li key={result.id}>
            {result.properties.title.title[0].text.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchDropdown;
