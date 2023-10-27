import axios from 'axios';


const ArticleAPI = {
  // 获取某个订阅的文章
  getFeed: (fid) => {
    return axios.get(`/api/v1/item/one/get/${fid}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching single feed articles:', error);
        throw error;
      });
  },

  // 立即解析RSS查看是否有新的更新，若有会存储到数据库
  updateFeed: (fid) => {
    return axios.get(`/api/v1/item/one/update/${fid}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error updating single feed:', error);
        throw error;
      });
  },

  // 获取全部订阅源的全部文章
  getAllItems: () => {
    return axios.get(`/api/v1/item/all/get`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching all articles:', error);
        throw error;
      });
  },

  // 刷新全部内容
  updateAllItems: () => {
    return axios.get(`/api/v1/item/all/update`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error updating all articles:', error);
        throw error;
      });
  }
};

export default ArticleAPI;
