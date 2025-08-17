import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Phone, MapPin } from 'lucide-react';
import Header from '../Component/Header';
import Sidebar from '../Component/Sidebar';
import { fetchStoresThunk } from '../features/stores/storeThunks';
import '../CSS/ProfilePage.css'; 

// CSS styles as a template literal
const styles = ` `;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stores, loading, error } = useSelector((state) => state.stores);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  // Fetch the stores on mount
  useEffect(() => {
    dispatch(fetchStoresThunk());
  }, [dispatch]);

  // Once stores load, automatically select the first one if none is selected
  useEffect(() => {
    if (stores && stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId]);

  const selectedStore = stores.find((store) => store.id === selectedStoreId);

  // Handler for clicking a store row
  const handleRowClick = (storeId) => {
    setSelectedStoreId(storeId);
  };

  // Build a Google Maps embed URL from store address details.
  const buildMapEmbedUrl = (store) => {
    if (!store) return '';
    const address = `${store.store_address} ${store.store_city} ${store.store_state} ${store.store_zipcode}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      address
    )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Main Content */}
        <main className="main-content" style={{ flex: 1, padding: '0' }}>
          <div className="profile-container">
            <div className="profile-header-container">
              <div className="profile-header">
                <div className="profile-info">
                  <div className="profile-image-container">
                    <img
                      src={user?.store_owner_profile?.image || '/banner/profile.png'}
                      alt="Profile"
                      className="profile-image"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-name-section">
              <div className="name-wrapper">
                <h1 className="profile-name">
                  {user?.store_owner_profile ? `${user.store_owner_profile.user.first_name} ${user.store_owner_profile.user.last_name}` : 'Store Owner Name'}
                </h1>
                <span className="profile-badge">🌟</span>
              </div>
              <div className="action-buttons">
                <button className="share-button">
                  <svg className="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </button>
                <button className="message-button">Update</button>
              </div>
            </div>

            <div className="credentials-section">
              <div className="credentials-list">
                <div className="credential-item">
                  <span className="credential-icon">
                    <Mail size={16} strokeWidth={1.5} />
                  </span>
                  <span className="credential-text">{user?.store_owner_profile?.user?.email || 'contact@example.com'}</span>
                </div>
                <div className="credential-item">
                  <span className="credential-icon">
                    <Phone size={16} strokeWidth={1.5} />
                  </span>
                  <span className="credential-text">
                    {user?.store_owner_profile?.phone_number || '(555) 123-4567'}
                  </span>
                </div>
                <div className="credential-item">
                  <span className="credential-icon">
                    <MapPin size={16} strokeWidth={1.5} />
                  </span>
                  <span className="credential-text">Store Owner</span>
                </div>
              </div>
            </div>

            {/* Stores Table */}
            <div className="info-section">
              {loading ? (
                <p>Loading stores...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : stores && stores.length > 0 ? (
                <div className="table-responsive">
                  <table className="stores-table">
                    <thead>
                      <tr>
                        <th>Store</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store) => (
                        <tr
                          key={store.id}
                          className={selectedStoreId === store.id ? 'selected' : ''}
                          onClick={() => handleRowClick(store.id)}
                        >
                          <td className="store-cell">
                            <img
                              src={store.image || '/default-store.png'}
                              alt={store.store_name}
                              className="store-image"
                              loading="lazy"
                            />
                            <span className="store-name">{store.store_name}</span>
                          </td>
                          <td className="location">
                            {`${store.store_address}, ${store.store_city}, ${store.store_state} ${store.store_zipcode}`}
                          </td>
                          <td>{store.status || 'Active'}</td>
                          <td>{store.store_activation_date || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No stores found.</p>
              )}
            </div>

            {/* Map Section */}
            {selectedStore && (
              <div className="map-container">
                <iframe
                  className="map-iframe"
                  title="Location Map"
                  src={buildMapEmbedUrl(selectedStore)}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
