import React from 'react';
import { Search,Bell, ArrowUpDown, Share2, Bug } from 'lucide-react';
import '../CSS/TriggerAlerts.css';
import Header from '../Component/Header';
import Sidebar from '../Component/Sidebar';
import ButtonHealth from '../Component/ButtonHealth';
import TriggerStatistics from '../Component/TriggerStatistics';

const TriggerAlertsPage = () => {
  // Sample data that matches the image specification
  const alerts = [
    {
      id: 1,
      storeName: 'Incentive Test',
      date: '14/01/2025, 9:02:15 AM',
      status: 'PENDING',
      videoEvidence: 'No Video Available'
    },
    {
      id: 2,
      storeName: 'Incentive Test',
      date: '10/01/2025, 12:40:51 PM',
      status: 'PENDING',
      videoEvidence: 'No Video Available'
    },
    {
      id: 3,
      storeName: 'Incentive Test',
      date: '10/01/2025, 11:54:46 AM',
      status: 'PENDING',
      videoEvidence: 'No Video Available'
    },
    {
      id: 4,
      storeName: 'Incentive Test',
      date: '10/01/2025, 9:07:55 AM',
      status: 'PENDING',
      videoEvidence: 'No Video Available'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
 

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar / search / timeframe */}
       
    <div className="trigger-alerts-container">
     

      <div className="ta-wrapper">
           {/* Header Section */}
           <div className="ta-header">
             <div className="ta-header__title-block">
               <Bell className="ta-header__bell-icon" />
               <h2 className="ta-header__heading">Recent Trigger Alerts</h2>
             </div>
             <Share2 className="ta-header__share-icon" />
           </div>
     
           {/* Table Section */}
           <div className="ta-table-wrapper">
             <table className="ta-table">
               <thead>
             
                 <tr>
                 <th>
                     <div className="ta-table__th-content">
                       S No.
                     </div>
                   </th>
                 
                   <th>
                     <div className="ta-table__th-content">
                       Store
                     </div>
                   </th>
                   <th>
                     <div className="ta-table__th-content">
                       Date
                     </div>
                   </th>
                   <th>
                     <div className="ta-table__th-content">
                       Status
                     </div>
                   </th>
                   <th>
                     <div className="ta-table__th-content">
                       Video Evidence
                     </div>
                   </th>
                 </tr>
               </thead>
               <tbody>
                 {alerts.map((alert, index) => (
                   <tr key={alert.id} className={`ta-table__row ${index % 2 === 0 ? 'ta-table__row--even' : 'ta-table__row--odd'}`}>
                      <td className="ta-table__cell">{alert.id}</td>
                     <td className="ta-table__cell">

                       <div className="ta-store">
                         <img 
                           src="/banner/login.png" 
                           alt={`${alert.store} icon`}
                           className="ta-store__image"
                         />
                         <span className="ta-store__name">{alert.store}</span>
                       </div>
                     </td>
                     <td className="ta-table__cell">{alert.date}</td>
                     <td className="ta-table__cell">
                       <span className="ta-status ta-status--pending">{alert.status}</span>
                     </td>
                     <td className="ta-table__cell">{alert.videoEvidence}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
     
        
         </div>
      <div className='health-statistics'>
        <ButtonHealth />
        <TriggerStatistics />

      </div>
    </div>
    </main>

      
    </div>
  );
};

export default TriggerAlertsPage;