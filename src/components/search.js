import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
const { Client } = require('@notionhq/client');

Modal.setAppElement('#root'); // Set the app element for the modal

const SearchDropdownContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 8px;
  font-size: 14px;
`;

const FiltersContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

const FilterOption = styled.span`
  margin-right: 10px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }

  ${({ active }) =>
    active &&
    `
    background-color: #007bff;
    color: white;
  `}
`;

const SearchResult = styled.div`
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Emoji = styled.span`
  margin-right: 8px;
  font-size: 18px;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
`;

const CustomModal = styled(Modal)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border: none;
  outline: none;
`;

const SearchDropdown = () => {
  const inputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);


  const emojis = ['📝', '🗓️', '👤'];

  const NOTION_API_KEY = 'secret_k15S4LDFByNsY7qwUgaBJa5Z15GQUie5nec5nMz1v9R';
  const notion = new Client({ auth: NOTION_API_KEY });

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowModal(true);
        inputRef.current.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await notion.search({
          query: searchValue,
          sort: {
            direction: 'ascending',
            timestamp: 'last_edited_time',
          },
        });

        setSearchResults(response.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (searchValue) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchValue]);

  const handleSearchResultClick = (result) => {
    setShowModal(false);
    console.log('Clicked on:', result);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <SearchDropdownContainer>
      <SearchInput
        type="text"
        placeholder="Search..."
        ref={inputRef}
        value={searchValue}
        onChange={handleSearchInputChange}
        className="block w-full rounded-xl border-2 border-layer-1 bg-muted-1 px-4 py-2.5 pl-11 pr-14 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
      />

      <CustomModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Search Modal"
      >
        <ModalContent>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchInputChange}
          />

          <FiltersContainer>
            <FilterOption
              onClick={() => handleFilterClick(null)}
              active={!activeFilter}
            >
              All
            </FilterOption>
            <FilterOption
              onClick={() => handleFilterClick('createdBy')}
              active={activeFilter === 'createdBy'}
            >
              Created by
            </FilterOption>
            <FilterOption
              onClick={() => handleFilterClick('titleOnly')}
              active={activeFilter === 'titleOnly'}
            >
              Title only
            </FilterOption>
            <FilterOption
              onClick={() => handleFilterClick('date')}
              active={activeFilter === 'date'}
            >
              Date
            </FilterOption>
          </FiltersContainer>

          {searchResults.map((result, index) => (
            <SearchResult key={index} onClick={() => handleSearchResultClick(result)}>
              <Emoji>{emojis[index % emojis.length]}</Emoji>
              {result.properties.title.title[0].plain_text}
            </SearchResult>
          ))}
        </ModalContent>
      </CustomModal>
    </SearchDropdownContainer>
  );
};

export default SearchDropdown;
