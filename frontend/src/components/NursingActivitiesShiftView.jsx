import { useMemo } from 'react';
import dayjs from 'dayjs';

const NursingActivitiesShiftView = ({ records }) => {
  // Group activities by shift
  const shiftData = useMemo(() => {
    const activities = records || [];
    
    // Define shift times
    const morningShift = { start: 7, end: 15 }; // 7 AM to 3 PM
    const afternoonShift = { start: 15, end: 23 }; // 3 PM to 11 PM
    const nightShift = { start: 23, end: 7 }; // 11 PM to 7 AM (next day)

    const getShift = (timestamp) => {
      const hour = dayjs(timestamp).hour();
      if (hour >= morningShift.start && hour < morningShift.end) return 'morning';
      if (hour >= afternoonShift.start && hour < afternoonShift.end) return 'afternoon';
      return 'night';
    };

    const grouped = {
      morning: [],
      afternoon: [],
      night: []
    };

    activities.forEach((record) => {
      const shift = getShift(record.timestamp);
      if (record.data) {
        grouped[shift].push(record);
      }
    });

    return grouped;
  }, [records]);

  const activityFields = [
    // Part I - Comfort, Safety and Privacy
    { key: 'comfortSafetyPrivacy', label: 'Comfort, Safety and Privacy Interventions' },
    { key: 'moderateHighBackRest', label: 'Placed on Moderate/High Back Rest' },
    { key: 'checkedNGTPlacement', label: 'Checked NGT Placement' },
    { key: 'maintainedSpecialMattress', label: 'Maintained Special Mattress' },
    { key: 'maintainedRestraints', label: 'Maintained Restraints' },
    { key: 'providedPrivacy', label: 'Provided Privacy' },
    // Part I - Psychosocial/Spiritual
    { key: 'renderedSpiritualSupport', label: 'Rendered Spiritual Support' },
    { key: 'explainedProcedure', label: 'Explained Procedure/Intervention' },
    { key: 'allowedCommunication', label: 'Allowed to Communicate Feelings' },
    { key: 'providedEmotionalSupport', label: 'Provided Emotional Support' },
    { key: 'orientedPersonPlaceTime', label: 'Oriented to Person, Place and Time' },
    // Part II
    { key: 'suctioning', label: 'Suctioning' },
    { key: 'tracheostomyCare', label: 'Tracheostomy Care' },
    { key: 'drainedMVTubes', label: 'Drained Mechanical Ventilator Tubes' },
    { key: 'oralCare', label: 'Oral Care' },
    { key: 'feedingTubes', label: 'Feeding Tubes' },
    { key: 'chestPulmophysiotherapy', label: 'Chest Pulmophysiotherapy' },
    { key: 'romExercises', label: 'ROM Exercises' },
    { key: 'turning', label: 'Turning' },
    { key: 'woundCare', label: 'Wound Care' },
    { key: 'perineumCare', label: 'Perineum Care' },
    { key: 'spongeBath', label: 'Sponge Bath' },
    { key: 'bloodExtraction', label: 'Blood Extraction' },
    { key: 'specimenCollection', label: 'Specimen Collection' },
    { key: 'prescriptionProvision', label: 'Prescription Provision' },
    { key: 'procedurePreparation', label: 'Procedure Preparation' },
    { key: 'referralFacilitation', label: 'Referral Facilitation' },
    { key: 'dvtProphylaxis', label: 'DVT Prophylaxis' },
    { key: 'pudProphylaxis', label: 'PUD Prophylaxis' },
    { key: 'vapBundles', label: 'VAP Bundles of Care' }
  ];

  const checkActivity = (shift, activityKey) => {
    return shiftData[shift].some((record) => {
      const value = record.data?.[activityKey];
      return value === true || value === 'true' || value === 1 || value === '1';
    });
  };

  const getActivityDetails = (shift, activityKey) => {
    // Get all records with this activity, not just the first one
    const records = shiftData[shift].filter((r) => {
      const value = r.data?.[activityKey];
      return value === true || value === 'true' || value === 1 || value === '1';
    });
    
    if (records.length === 0) return null;
    
    // Build details string with timestamps
    const details = records.map((record) => {
      const time = dayjs(record.timestamp).format('HH:mm');
      let detail = time;
      
      // Get additional details for specific activities
      if (activityKey === 'procedurePreparation' && record.data?.procedurePreparationSpecify) {
        detail += ` - ${record.data.procedurePreparationSpecify}`;
      }
      if (activityKey === 'referralFacilitation' && record.data?.referralFacilitationSpecify) {
        detail += ` - ${record.data.referralFacilitationSpecify}`;
      }
      if (activityKey === 'dvtProphylaxis' && record.data?.dvtProphylaxisSpecify) {
        detail += ` - ${record.data.dvtProphylaxisSpecify}`;
      }
      if (activityKey === 'pudProphylaxis' && record.data?.pudProphylaxisSpecify) {
        detail += ` - ${record.data.pudProphylaxisSpecify}`;
      }
      if (activityKey === 'vapBundles' && record.data?.vapBundlesSpecify) {
        detail += ` - ${record.data.vapBundlesSpecify}`;
      }
      
      return detail;
    });
    
    return details.join('; ');
  };
  
  const getActivityCount = (shift, activityKey) => {
    return shiftData[shift].filter((r) => {
      const value = r.data?.[activityKey];
      return value === true || value === 'true' || value === 1 || value === '1';
    }).length;
  };

  return (
    <div className="nursing-activities-shift-view">
      <div className="card">
        <h2>Nursing Activities Checklist - Shift View</h2>
        <p className="muted">
          Check (✓) indicates the intervention was done. M = Morning (7AM-3PM), A = Afternoon (3PM-11PM), N = Night (11PM-7AM)
        </p>

        {/* Part I - Comfort, Safety and Privacy */}
        <div className="activities-section">
          <h3>Part I - Comfort, Safety and Privacy Interventions</h3>
          <div className="table-responsive">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th className="shift-col">M</th>
                  <th className="shift-col">A</th>
                  <th className="shift-col">N</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {activityFields.slice(0, 6).map((activity) => {
                  const morningCount = getActivityCount('morning', activity.key);
                  const afternoonCount = getActivityCount('afternoon', activity.key);
                  const nightCount = getActivityCount('night', activity.key);
                  const allDetails = [
                    getActivityDetails('morning', activity.key),
                    getActivityDetails('afternoon', activity.key),
                    getActivityDetails('night', activity.key)
                  ].filter(Boolean).join(' | ');
                  
                  return (
                    <tr key={activity.key}>
                      <td>{activity.label}</td>
                      <td className="shift-col">
                        {checkActivity('morning', activity.key) ? (
                          <span title={getActivityDetails('morning', activity.key) || ''}>
                            ✓ {morningCount > 1 ? `(${morningCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('afternoon', activity.key) ? (
                          <span title={getActivityDetails('afternoon', activity.key) || ''}>
                            ✓ {afternoonCount > 1 ? `(${afternoonCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('night', activity.key) ? (
                          <span title={getActivityDetails('night', activity.key) || ''}>
                            ✓ {nightCount > 1 ? `(${nightCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="remarks-col" title={allDetails || ''}>
                        {allDetails || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Part I - Psychosocial/Spiritual */}
        <div className="activities-section">
          <h3>Part I - Psychosocial/Spiritual Nursing Interventions</h3>
          <div className="table-responsive">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th className="shift-col">M</th>
                  <th className="shift-col">A</th>
                  <th className="shift-col">N</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {activityFields.slice(6, 11).map((activity) => {
                  const morningCount = getActivityCount('morning', activity.key);
                  const afternoonCount = getActivityCount('afternoon', activity.key);
                  const nightCount = getActivityCount('night', activity.key);
                  const allDetails = [
                    getActivityDetails('morning', activity.key),
                    getActivityDetails('afternoon', activity.key),
                    getActivityDetails('night', activity.key)
                  ].filter(Boolean).join(' | ');
                  
                  return (
                    <tr key={activity.key}>
                      <td>{activity.label}</td>
                      <td className="shift-col">
                        {checkActivity('morning', activity.key) ? (
                          <span title={getActivityDetails('morning', activity.key) || ''}>
                            ✓ {morningCount > 1 ? `(${morningCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('afternoon', activity.key) ? (
                          <span title={getActivityDetails('afternoon', activity.key) || ''}>
                            ✓ {afternoonCount > 1 ? `(${afternoonCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('night', activity.key) ? (
                          <span title={getActivityDetails('night', activity.key) || ''}>
                            ✓ {nightCount > 1 ? `(${nightCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="remarks-col" title={allDetails || ''}>
                        {allDetails || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Part II */}
        <div className="activities-section">
          <h3>Part II - Nursing Activities</h3>
          <div className="table-responsive">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th className="shift-col">M</th>
                  <th className="shift-col">A</th>
                  <th className="shift-col">N</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {activityFields.slice(11).map((activity) => {
                  const morningCount = getActivityCount('morning', activity.key);
                  const afternoonCount = getActivityCount('afternoon', activity.key);
                  const nightCount = getActivityCount('night', activity.key);
                  const allDetails = [
                    getActivityDetails('morning', activity.key),
                    getActivityDetails('afternoon', activity.key),
                    getActivityDetails('night', activity.key)
                  ].filter(Boolean).join(' | ');
                  
                  return (
                    <tr key={activity.key}>
                      <td>{activity.label}</td>
                      <td className="shift-col">
                        {checkActivity('morning', activity.key) ? (
                          <span title={getActivityDetails('morning', activity.key) || ''}>
                            ✓ {morningCount > 1 ? `(${morningCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('afternoon', activity.key) ? (
                          <span title={getActivityDetails('afternoon', activity.key) || ''}>
                            ✓ {afternoonCount > 1 ? `(${afternoonCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('night', activity.key) ? (
                          <span title={getActivityDetails('night', activity.key) || ''}>
                            ✓ {nightCount > 1 ? `(${nightCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="remarks-col" title={allDetails || ''}>
                        {allDetails || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NursingActivitiesShiftView;

