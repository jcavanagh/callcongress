import axios from 'axios';

//Simple facade for sunlight foundation apis
export default {
  legislators: {
    locate: async (location) => {
      const params = typeof location === 'object' ? location : { zip: location };
      return await axios.get('/gov/legislators/locate', params);
    }
  }
};