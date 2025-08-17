import React, { useEffect, useState } from 'react';
import { Search, Menu, Bell, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoresThunk } from '../features/stores/storeThunks'; 
import { fetchReportsThunk } from '../features/reports/reportThunks'; 
import { fetchTransactionsThunk } from '../features/transactions/transactionThunks';
import { useNavigate } from 'react-router-dom';

// Define the Header component
function Header({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get stores and auth state from Redux
  const { stores, loading, error } = useSelector((state) => state.stores);
  const { user } = useSelector((state) => state.auth);

  // Local state
  const [isStoreDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState({ id: null, store_name: 'All Stores' });
  const [notificationCount, setNotificationCount] = useState(0); // Example notification count
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch the store list on mount
  useEffect(() => {
    dispatch(fetchStoresThunk());
  }, [dispatch]);

  // Toggle store dropdown
  const toggleStoreDropdown = () => setStoreDropdownOpen(!isStoreDropdownOpen);

  // Toggle notification dropdown
  const toggleNotificationDropdown = () => setNotificationDropdownOpen(!isNotificationDropdownOpen);

  // Navigate to profile page
  const navigateToProfile = () => {
    navigate('/profile-page');
  };

  // When the user selects a store
  const selectStore = (store) => {
    setSelectedStore(store);
    setStoreDropdownOpen(false);

    // Fetch or refresh data based on the selected store
    if (!store.id) {
      // "All Stores" logic
      dispatch(fetchReportsThunk());
      dispatch(fetchTransactionsThunk());
    } else {
      // Single store logic
      dispatch(fetchReportsThunk(store.id));
      dispatch(fetchTransactionsThunk(store.id));
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    // Perform search on page content
    performSearch(query);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      performSearch(searchQuery);
    }
  };

  // Search functionality
  const performSearch = (query) => {
    const searchText = query.toLowerCase();
    
    // Get all text nodes from the document (text content only, not HTML)
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      // Skip empty text nodes and nodes with just whitespace
      if (node.nodeValue.trim() !== '') {
        textNodes.push(node);
      }
    }
    
    // Search through the text nodes
    const results = [];
    textNodes.forEach(node => {
      const text = node.nodeValue.trim();
      if (text.toLowerCase().includes(searchText)) {
        // Get the parent element that contains this text
        const element = node.parentElement;
        
        // Create a clean text snippet
        const startPos = text.toLowerCase().indexOf(searchText);
        const endPos = startPos + searchText.length;
        
        // Create context around the matched text (showing before and after)
        const startContext = Math.max(0, startPos - 20);
        const endContext = Math.min(text.length, endPos + 20);
        let snippetText = text.substring(startContext, endContext);
        
        // Add ellipsis if needed
        if (startContext > 0) snippetText = '...' + snippetText;
        if (endContext < text.length) snippetText = snippetText + '...';
        
        results.push({
          element,
          text: snippetText,
          node: node // Store the actual text node for highlighting
        });
      }
    });
    
    // Filter out duplicates and limit results
    const uniqueResults = results
      .filter((result, index, array) => 
        array.findIndex(r => r.text === result.text) === index
      )
      .slice(0, 5);
    
    setSearchResults(uniqueResults);
    setIsSearching(false);
  };

  // Highlight search result on click
  const highlightResult = (result) => {
    // Remove any existing highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      el.classList.remove('search-highlight');
    });
    
    // Get the parent element that contains this text
    const element = result.element;
    
    // Create a highlight span
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'search-highlight';
    
    // Replace the text node with highlighted version
    const originalNode = result.node;
    const text = originalNode.nodeValue;
    const searchText = searchQuery.toLowerCase();
    const startPos = text.toLowerCase().indexOf(searchText);
    
    if (startPos !== -1) {
      // Split the text node into three parts: before match, match, after match
      const before = document.createTextNode(text.substring(0, startPos));
      const match = document.createTextNode(text.substring(startPos, startPos + searchText.length));
      const after = document.createTextNode(text.substring(startPos + searchText.length));
      
      // Replace the original node with the three new nodes
      highlightSpan.appendChild(match);
      
      const fragment = document.createDocumentFragment();
      fragment.appendChild(before);
      fragment.appendChild(highlightSpan);
      fragment.appendChild(after);
      
      originalNode.parentNode.replaceChild(fragment, originalNode);
    } else {
      // Fallback to highlighting the entire element if exact match not found
      element.classList.add('search-highlight');
    }
    
    // Scroll to the element
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Close search results
    setSearchResults([]);
    
    // Set a timeout to remove the highlight after a few seconds
    setTimeout(() => {
      if (highlightSpan.parentNode) {
        // Restore original text node structure
        const parent = highlightSpan.parentNode;
        const textContent = highlightSpan.textContent;
        const replacement = document.createTextNode(textContent);
        parent.replaceChild(replacement, highlightSpan);
      }
      document.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight');
      });
    }, 3000);
  };

  // Construct store options with "All Stores" always available
  const storeOptions = [
    { id: null, store_name: 'All Stores' },
    ...stores,
  ];

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <img src="banner/logo.png" alt="Logo" />
        </div>

        {/* Search Container (desktop only) */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Try searching 'insights'"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="search-result-item"
                    onClick={() => highlightResult(result)}
                  >
                    {result.text}
                  </div>
                ))}
              </div>
            )}
            {isSearching && (
              <div className="search-loading">Searching...</div>
            )}
          </form>
        </div>

        {/* Right Section */}
        <div className="actions">
          {/* Store Selector */}
          <div className="store-selector">
            <button className="store-selector-button" onClick={toggleStoreDropdown}>
              {selectedStore.store_name}
              <ChevronDown className="dropdown-icon" />
            </button>
            {isStoreDropdownOpen && (
              <div className="store-dropdown">
                {loading && <div className="store-option">Loading stores...</div>}
                {error && <div className="store-option">Error: {error}</div>}
                {!loading && !error && storeOptions.map((store) => (
                  <div 
                    key={store.id || 'all'}
                    className="store-option"
                    onClick={() => selectStore(store)}
                  >
                    {store.store_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menu button */}
          <button className="icon-button" onClick={onMenuClick}>
            <Menu className="menu-icon" />
          </button>

          {/* Avatar with profile picture - now clickable */}
          <div className="avatar-container" onClick={navigateToProfile}>
            {user && user.store_owner_profile && user.store_owner_profile.image ? (
              <img src={user.store_owner_profile.image} alt="Profile" className="avatar" />
            ) : (
              <div className="avatar" />
            )}
          </div>

          {/* Notification Bell */}
          <div className="notification-container">
            <button className="icon-button notification-button" onClick={toggleNotificationDropdown}>
              <Bell className="menu-icon" />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
            {isNotificationDropdownOpen && (
              <div className="notification-dropdown">
                <div className="notification-item">No new notifications</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="mobile-search-bar">
        <form onSubmit={handleSearchSubmit} className="mobile-search-wrapper">
          <Search className="mobile-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="mobile-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <div className="mobile-search-results">
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className="search-result-item"
                  onClick={() => highlightResult(result.element)}
                >
                  {result.text}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: transparent;
          width: 100%;
          box-sizing: border-box;
        }
        .logo img {
          width: 98px;
        }
        .search-container {
          flex: 1;
          max-width: 400px;
          margin: 0 16px;
        }
        .search-wrapper {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #9ca3af;
        }
        .search-input {
          width: 100%;
          padding: 8px 16px 8px 40px;
          background: #fff;
          border-radius: 20px;
          font-size: 14px;
          border: 1px solid #e5e7eb;
        }
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .search-results, .mobile-search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          z-index: 20;
          max-height: 300px;
          overflow-y: auto;
        }
        .mobile-search-results {
          top: calc(100% + 4px);
        }
        .search-result-item {
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
        }
        .search-result-item:hover {
          background: #f9fafb;
        }
        .search-loading {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: #6b7280;
        }
        .search-highlight {
          background-color: #fef08a !important;
          outline: 2px solid #fef08a;
          transition: background-color 0.3s;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .store-selector {
          position: relative;
        }
        .store-selector-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
        }
        .store-selector-button:hover {
          background: #f9fafb;
        }
        .dropdown-icon {
          width: 16px;
          height: 16px;
          color: #6b7280;
        }
        .store-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 10;
          margin-top: 4px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          width: 150px;
        }
        .store-option {
          padding: 8px 12px;
          cursor: pointer;
        }
        .store-option:hover {
          background: #f3f4f6;
        }
        .icon-button {
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .icon-button:hover {
          background-color: rgb(222, 64, 64);
        }
        .menu-icon {
          width: 20px;
          height: 20px;
          color: #4b5563;
        }
        .notification-button {
          position: relative;
          background: #d82d57;
          color: white;
        }
        .notification-button .menu-icon {
          width: 20px;
          height: 20px;
          color: white;
        }
        .notification-badge {
          position: absolute;
          top: -10%;
          right: -10%;
          background-color: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: bold;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-container {
          width: 32px;
          height: 32px;
          cursor: pointer; /* Make it clear it's clickable */
          transition: transform 0.2s ease;
        }
        .avatar-container:hover {
          transform: scale(1.05); /* Slight enlargement on hover */
          box-shadow: 0 0 0 2px rgba(216, 45, 87, 0.2); /* Red glow on hover */
          border-radius: 50%;
        }
        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .notification-container {
          position: relative;
        }
        .notification-dropdown {
          position: absolute;
          top: 110%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          width: 200px;
          padding: 8px;
          z-index: 10;
        }
        .notification-item {
          padding: 8px 12px;
        }
        .mobile-search-bar {
          display: none;
          padding: 12px 16px 12px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }
        .mobile-search-wrapper {
          position: relative;
          width: 100%;
        }
        .mobile-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #9ca3af;
        }
        .mobile-search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          background: #f3f4f6;
          border-radius: 20px;
          font-size: 14px;
          border: 1px solid #e5e7eb;
        }
        @media (max-width: 768px) {
          .search-container {
            display: none;
          }
          .mobile-search-bar {
            display: block;
          }
          .store-selector-button {
            padding: 10px;
            font-size: 12px;
          }
          .actions {
            gap: 8px;
          }
          .header {
            border: none;
          }
          .mobile-search-input {
            box-sizing: border-box;
          }
        }
      `}</style>
    </>
  );
}

// Make sure we export the component correctly
export default Header;