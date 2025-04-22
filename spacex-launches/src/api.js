 export const fetchLaunches = async (page = 0, pageSize = 10) => {
    const url = `https://api.spacexdata.com/v3/launches?offset=${page * pageSize}&limit=${pageSize}`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    return data;  
  };
  