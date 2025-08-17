import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQueryThunk } from '../features/queries/queryThunks';
import '../CSS/AssignTasksModal.css'; // Import your custom CSS
const AssignTasksModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.stores.stores);
  const [subject, setSubject] = useState('');
  const [store, setStore] = useState('');
  const [comment, setComment] = useState(
    'Request Team Survill to assign tasks to your staff.e.g. Please request the cashiers to make coffee at every 3 hour interval'
  );

  const handleSubmit = () => {
    // Find the selected store object using the store id from state
    const selectedStore = stores.find((s) => s.id.toString() === store);
    // Extract the owner from the selected store, if available
    const storeOwner = selectedStore ? selectedStore.owner : '';

    // Dispatch a new assign task query with store_owner included
    dispatch(
      createQueryThunk({
        query_type: 'assign_task',
        subject,
        store, // store id
        store_owner: storeOwner, // include the owner value from the store
        status: 'Requested',
        task_assigned: comment, // using the 'details' field to store the comment
      })
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="task-modal__overlay">
      <div className="task-modal__container">
        <div className="task-modal__header">
          <h2 className="task-modal__title">Assign Tasks</h2>
          <div className="task-modal__button-group">
            <button className="task-modal__expand-button">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button onClick={onClose} className="task-modal__close-button">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="task-modal__body">
          <div className="task-form__group">
            <label className="task-form__label">Subject</label>
            <input
              type="text"
              placeholder="Enter Subject Here"
              className="task-form__input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="task-form__group">
            <label className="task-form__label">Store</label>
            <select
              className="task-form__select"
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

          <div className="task-form__group">
            <label className="task-form__label">Comment</label>
            <textarea
              className="task-form__textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="task-modal__footer">
          <button onClick={handleSubmit} className="task-modal__submit-button">
            <svg className="task-modal__button-icon" width="16" height="16" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" fill="none" stroke="white" strokeWidth="2" />
            </svg>
            Submit
          </button>
          <button onClick={onClose} className="task-modal__cancel-button">
            <svg className="task-modal__button-icon" width="16" height="16" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default AssignTasksModal;
