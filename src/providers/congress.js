import axios from 'axios';

//Simple facade for sunlight foundation apis
export default {
  legislators: {
    leadership: async () => {
      return await axios.get('/gov/legislators', { params: { per_page: 'all' }}).then((resp) => {
        const leaders = resp.data.results.filter(r => r.leadership_role);
        const house = leaders.filter(l => l.chamber === 'house');
        const senate = leaders.filter(l => l.chamber === 'senate');

        return { house, senate };
      });
    },

    locate: async (loc) => {
      if(loc) {
        const params = loc.hasOwnProperty('latitude') ? loc : { zip: loc };
        return await axios.get('/gov/legislators/locate', { params }).then((resp) => {
          return resp.data.results;
        }).catch(error => console.log(error));
      }

      console.warn('legislators/locate called without location');
      return [];
    }
  }
};