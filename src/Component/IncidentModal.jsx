import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQueryThunk } from '../features/queries/queryThunks';

const IncidentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.stores.stores);
  const [subject, setSubject] = useState('');
  const [store, setStore] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [incidentDetails, setIncidentDetails] = useState('');

  const handleSubmit = () => {
    // Find the selected store object using the store id from state
    const selectedStore = stores.find((s) => s.id.toString() === store);
    
    // If there's a selected store, extract the owner; otherwise, default to an empty value or handle appropriately
    const storeOwner = selectedStore ? selectedStore.owner : '';
  
    // Dispatch a new incident query with store_owner included
    dispatch(
      createQueryThunk({
        query_type: 'incident',
        subject,
        store, // store id
        store_owner: storeOwner, // include the owner value from the store
        status: 'Requested',
        details: incidentDetails, // mapped to 'details' field in the model
        incident_date: incidentDate,
        incident_time: incidentTime,
      })
    );
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="incident-modal__overlay">
      <div className="incident-modal__container">
        <div className="incident-modal__header">
          <h2 className="incident-modal__title">Incident Video</h2>
          <div className="incident-modal__button-group">
            <button className="incident-modal__expand-button">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button onClick={onClose} className="incident-modal__close-button">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="incident-modal__body">
          <div className="incident-form__group">
            <label className="incident-form__label">Subject</label>
            <input
              type="text"
              placeholder="Enter Subject Here"
              className="incident-form__input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="incident-form__group">
            <label className="incident-form__label">Store</label>
            <select
              className="incident-form__select"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            >
              <option value="">Select Store</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.store_name}
                </option>
              ))}
            </select>
          </div>

          <div className="incident-form__row">
            <div className="incident-form__group incident-form__group--half">
              <label className="incident-form__label">Incident Date</label>
              <div className="incident-form__date-container">
                <input
                  type="date"
                  className="incident-form__input"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
                <button className="incident-form__calendar-button">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="white" strokeWidth="2" />
                    <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" />
                    <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="incident-form__group incident-form__group--half">
              <label className="incident-form__label">Incident Time (Approx)</label>
              <input
                type="time"
                className="incident-form__input"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
              />
            </div>

          </div>

          <div className="incident-form__group">
            <label className="incident-form__label">Enter Incident Details Here</label>
            <textarea
              className="incident-form__textarea"
              placeholder="Provide detailed information about the incident..."
              value={incidentDetails}
              onChange={(e) => setIncidentDetails(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="incident-modal__footer">
          <button onClick={handleSubmit} className="incident-modal__submit-button">
            <svg className="incident-modal__button-icon" width="16" height="16" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" fill="none" stroke="white" strokeWidth="2" />
            </svg>
            Submit
          </button>
          <button onClick={onClose} className="incident-modal__cancel-button">
            <svg className="incident-modal__button-icon" width="16" height="16" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
      <style jsx>{`
        .incident-modal__overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1000;
        }
        
        .incident-modal__container {
          background-color: white;
          border-radius: 8px;
          width: 100%;
          max-width: 560px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        
        .incident-modal__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eaeaea;
          background-color: #f9f9f9;
        }
        
        .incident-modal__title {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          color: #333;
        }
        
        .incident-modal__button-group {
          display: flex;
          gap: 12px;
        }
        
        .incident-modal__expand-button,
        .incident-modal__close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .incident-modal__expand-button:hover,
        .incident-modal__close-button:hover {
          background-color: #f0f0f0;
        }
        
        .incident-modal__body {
          padding: 24px;
        }
        
        .incident-form__group {
          margin-bottom: 24px;
        }
        
        .incident-form__label {
          display: block;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #444;
        }
        
        .incident-form__input,
        .incident-form__select,
        .incident-form__textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 15px;
          transition: border-color 0.2s, box-shadow 0.2s;
              box-sizing: border-box;

        }
        
        .incident-form__input:focus,
        .incident-form__select:focus,
        .incident-form__textarea:focus {
          outline: none;
          border-color: #b08d44;
          box-shadow: 0 0 0 3px rgba(176, 141, 68, 0.2);
        }
        
        .incident-form__textarea {
          height: 180px;
          line-height: 1.5;
              resize: none;

        }
        
        .incident-form__row {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .incident-form__group--half {
          width: calc(50% - 10px);
          margin-bottom: 0;
        }
        
        .incident-form__date-container {
          position: relative;
        }
        
        .incident-form__calendar-button {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #d72e59;
          border: none;
          border-radius: 4px;
          padding: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .incident-form__calendar-button:hover {
          background-color:rgb(188, 41, 78);
        }
        
        .incident-modal__footer {
          display: flex;
          justify-content: flex-end;
          padding: 20px 24px;
          gap: 16px;
          border-top: 1px solid #eaeaea;
          background-color: #f9f9f9;
        }
        
        .incident-modal__submit-button,
        .incident-modal__cancel-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.2s, transform 0.1s;
        }
        
        .incident-modal__submit-button:hover,
        .incident-modal__cancel-button:hover {
          transform: translateY(-1px);
        }
        
        .incident-modal__submit-button:active,
        .incident-modal__cancel-button:active {
          transform: translateY(1px);
        }
        
        .incident-modal__submit-button {
          background-color: #d72e59;
          color: white;
          min-width: 120px;
        }
        
        .incident-modal__submit-button:hover {
          background-color: rgb(188, 41, 78);
        }
        
        .incident-modal__cancel-button {
          background-color: #333;
          color: white;
          min-width: 120px;
        }
        
        .incident-modal__cancel-button:hover {
          background-color: #222;
        }
        
        .incident-modal__button-icon {
          margin-right: 10px;
        }

        /* Add responsive styles */
        @media (max-width: 600px) {
          .incident-modal__overlay {
            padding: 16px;
          }
          
          .incident-form__row {
            flex-direction: column;
            gap: 16px;
          }
          
          .incident-form__group--half {
            width: 100%;
          }
          
          .incident-modal__footer {
            flex-direction: column;
          }
          
          .incident-modal__submit-button,
          .incident-modal__cancel-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default IncidentModal;
