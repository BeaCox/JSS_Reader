// TestAPI.js, 在App.js中配置了路由 
import React, { useEffect, useState } from 'react';
import axios from 'axios';  

function TestAPI() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/v1/item/all/get')
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(err.toString());
      });
  }, []);

  return (
    <div>
      <h2>API Test</h2>
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h3>Data Received:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>  {/* 显示格式化的 JSON 数据 */}
        </div>
      )}
    </div>
  );
}

export default TestAPI;
