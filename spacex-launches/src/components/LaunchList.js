import React, { useState, useEffect } from 'react';
import { fetchLaunches } from '../api'; 
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingSpinner from './LoadingSpinner';
import { fuzzySearch } from '../utils/fuzzySearch'; 

const LaunchList = ({ searchTerm }) => {
  const [launches, setLaunches] = useState([]); 
  const [filteredLaunches, setFilteredLaunches] = useState([]); 
  const [hasMore, setHasMore] = useState(true); 
  const [loading, setLoading] = useState(false); 
  const [page, setPage] = useState(1); 
  const [expandedLaunchId, setExpandedLaunchId] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const newLaunches = await fetchLaunches(1); 
      setLaunches(newLaunches);
      setFilteredLaunches(newLaunches); 
      setHasMore(newLaunches.length > 0); 
      setLoading(false);
    };

    fetchInitialData();
  }, []); 

  useEffect(() => {
    if (searchTerm) {
      const filtered = fuzzySearch(searchTerm, launches); 
      setFilteredLaunches(filtered);
    } else {
      setFilteredLaunches(launches); 
    }
  }, [searchTerm, launches]); 

  const loadMoreData = async () => {
    if (!loading && hasMore) {
      setLoading(true);
      const nextPage = page + 1;
      const newLaunches = await fetchLaunches(nextPage); 

      if (newLaunches.length > 0) {
        const updatedLaunches = [...launches, ...newLaunches];
        setLaunches(updatedLaunches);
        
        if (searchTerm) {
          setFilteredLaunches(fuzzySearch(searchTerm, updatedLaunches));
        } else {
          setFilteredLaunches(updatedLaunches);
        }
        
        setPage(nextPage);
      } else {
        setHasMore(false); 
      }
      
      setLoading(false);
    }
  };

  const toggleLaunchDetails = (id) => {
    setExpandedLaunchId((prevId) => (prevId === id ? null : id));
  };
  
  
  const getLaunchStatus = (launch) => {
    const launchDate = new Date(launch.launch_date_utc);
    const now = new Date();
    
    
    let status = '';
    let bgColor = '';
    
    if (!launch.launch_success && launchDate > now) {
      status = 'upcoming';
      bgColor = '#17a2b8'; 
    } else if (launch.launch_success === true) {
      status = 'success';
      bgColor = '#28a745'; 
    } else if (launch.launch_success === false) {
      status = 'failed';
      bgColor = '#dc3545'; 
    } else if (launchDate < now) {
      status = 'unknown';
      bgColor = '#6c757d'; 
    }
    
    return {
      status,
      style: {
        backgroundColor: bgColor,
        color: '#fff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
        marginLeft: '10px'
      }
    };
  };

  return (
    <div>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }} id="scrollableDiv">
        <InfiniteScroll
          dataLength={filteredLaunches.length}
          next={loadMoreData} 
          hasMore={!searchTerm && hasMore} 
          loader={<LoadingSpinner />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              {searchTerm 
                ? 'End of search results' 
                : 'No more launches available'}
            </p>
          }
          scrollableTarget="scrollableDiv"
          style={{
            overflow:'hidden'
          }}
        >
          <div>
            {filteredLaunches.length > 0 ? (
              filteredLaunches.map((launch) => {
                const launchStatus = getLaunchStatus(launch);
                
                return (
                  <div
                    key={launch.flight_number}
                    className="launch-item"
                    style={{
                      marginBottom: '1rem',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>{launch.mission_name}</h3>
                      <span style={launchStatus.style}>{launchStatus.status}</span>
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                      <button
                        onClick={() => toggleLaunchDetails(launch.flight_number)}
                        className="view-hide-btn"
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '5px 15px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {expandedLaunchId === launch.flight_number
                          ? 'Hide Details'
                          : 'View Details'}
                      </button>
                    </div>

                    {expandedLaunchId === launch.flight_number && (
                      <div className="launch-details" style={{ marginTop: '0.5rem' }}>
                        <p>
                          <strong>Rocket:</strong> {launch.rocket?.rocket_name || 'N/A'}
                        </p>
                        <p>
                          <strong>Launch Date:</strong>{' '}
                          {new Date(launch.launch_date_utc).toLocaleString()}
                        </p>
                        <p>
                          <strong>Details:</strong> {launch.details || 'No details available.'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center' }}>
                {searchTerm ? 'No launches match your search' : 'No launches available'}
              </p>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default LaunchList;