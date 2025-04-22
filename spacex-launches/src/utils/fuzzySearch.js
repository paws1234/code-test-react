export const fuzzySearch = (searchTerm, launches, threshold = 3) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    
    const isSequentialMatch = (searchTerm, missionName) => {
      let searchIndex = 0;
      for (let i = 0; i < missionName.length; i++) {
        if (missionName[i] === searchTerm[searchIndex]) {
          searchIndex++;
          if (searchIndex === searchTerm.length) return true; 
        }
      }
      return false;
    };

    
    const sequentialMatches = launches.filter((launch) => {
      const missionName = launch.mission_name.toLowerCase();
      return isSequentialMatch(lowerSearchTerm, missionName);
    });

    
    const fuzzyMatches = launches.filter((launch) => {
      const missionName = launch.mission_name.toLowerCase();
      const distance = levenshtein(lowerSearchTerm, missionName);
      return distance <= threshold && !isSequentialMatch(lowerSearchTerm, missionName);
    });

    
    return [...sequentialMatches, ...fuzzyMatches];
  };

  
  const levenshtein = (a, b) => {
    const lenA = a.length;
    const lenB = b.length;

    if (Math.abs(lenA - lenB) > 3) return Math.max(lenA, lenB);

    const tmp = Array(lenA + 1);
    for (let i = 0; i <= lenA; i++) {
      tmp[i] = [i];
    }
    for (let j = 0; j <= lenB; j++) {
      tmp[0][j] = j;
    }

    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1,     
          tmp[i][j - 1] + 1,     
          tmp[i - 1][j - 1] + cost 
        );

        if (tmp[i][j] > 3) return tmp[i][j];
      }
    }

    return tmp[lenA][lenB];
  };
