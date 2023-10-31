import axios from 'axios';

const ArticleAPI = {

  // 获取某个订阅的文章
  getFeed: async (fid, params) => {
    return axios.get(`/api/v1/item/one/get/${fid}`, { params })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching single feed articles:', error);
        throw error;
      });
  },

  // 立即解析RSS查看是否有新的更新，若有会存储到数据库
  updateFeed: async (fid) => {
    return axios.get(`/api/v1/item/one/update/${fid}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error updating single feed:', error);
        throw error;
      });
  },

  // 获取全部订阅源的全部文章
  getAllItems: async (params) => {
    return axios.get(`/api/v1/item/all/get`, { params })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching all articles:', error);
        throw error;
      });
  },

  // 刷新全部内容
  updateAllItems: async (params) => {
    return axios.get(`/api/v1/item/all/update`, { params })
      .then(response => response.data)
      .catch(error => {
        console.error('Error updating all articles:', error);
        throw error;
      });
  },

  // 收藏某篇文章
  starItem: async (iid) => {
    return axios.get(`/api/v1/star/${iid}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error starring item:', error);
        throw error;
      });
  },

  // 取消收藏某篇文章
  unstarItem: async (iid) => {
    return axios.get(`/api/v1/unstar/${iid}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error unstarring item:', error);
        throw error;
      });
  },

  // 已读某篇文章
  markItemAsRead: async (iid) => {
    return axios.get(`/api/v1/read/one/${iid}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error marking item as read:', error);
        throw error;
      });
  },

  // 一键已读某个feed下所有item
  markFeedAsRead: async (fid) => {
    return axios.get(`/api/v1/read/feed/${fid}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error marking feed as read:', error);
        throw error;
      });
  },

  // 一键已读所有的文章
  markAllAsRead: async () => {
    return axios.get(`/api/v1/read/all`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error marking all as read:', error);
        throw error;
      });
  },  

// 取消已读某篇文章
  markItemAsUnread: async (iid) => {
  return axios.get(`/api/v1/unread/one/${iid}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error marking item as read:', error);
      throw error;
    });
},

// 一键取消已读某个feed下所有item
markFeedAsUnread: async (fid) => {
  return axios.get(`/api/v1/unread/feed/${fid}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error marking feed as read:', error);
      throw error;
    });
},

// 一键取消已读所有的文章
markAllAsUnread: async () => {
  return axios.get(`/api/v1/unread/all`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error marking all as read:', error);
      throw error;
    });
},

// 获取explore页不同分类下feed信息
getFeedByCategory: async (category) => {
  return axios.get(`/api/v1/explore/${category}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching feed by category:', error);
      throw error;
    });
},

};

export default ArticleAPI;
