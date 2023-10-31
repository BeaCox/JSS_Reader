import axios from 'axios';

const FEED_BASE_URL = '/api/v1/feed/category/';

export const addFeedToCategory = (categoryName, name, url) => {
    return axios.post(`${FEED_BASE_URL}${categoryName}`, { name, url });
};

export const getFeedsByCategory = (categoryName) => {
    return axios.get(`${FEED_BASE_URL}${categoryName}`);
};

export const updateFeed = (fid, newName, newUrl) => {
    return axios.put(FEED_BASE_URL, {
      fid,
      newName,
      newUrl
    });
};

export const deleteFeed = (categoryName, fid) => {
    return axios.delete(`${FEED_BASE_URL}${categoryName}`, {
      data: {
        fid: fid.toString()
      }
    });
};
