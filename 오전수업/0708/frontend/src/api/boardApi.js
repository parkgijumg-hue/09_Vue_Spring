import api from '@/api'; //index.js에 있는 instance(axios인터셉터 정의되어있는 것)

//컴포넌트에서 전체 리스트를 가지고 오는 함수를 호출해서 사용함.
//내보내주어야함.
const BASE_URL = '/api/board';
const headers = { 'Content-Type': 'multipart/form-data' };

export default {
  async getList(params) {
    //tomcat서버 연결해서 [json, json, json]
    const { data } = await api.get(BASE_URL, { params });
    console.log('받은 게시판 리스트: ', data);
    return data;
  },
  async create(article) {
    const formData = new FormData();
    formData.append('title', article.title);
    formData.append('writer', article.writer);
    formData.append('content', article.content);
    if (article.files) {
      for (let i = 0; i < article.files.length; i++) {
        formData.append('files', article.files[i]);
      }
    }
    const { data } = await api.post(BASE_URL, formData, { headers });
    console.log('BOARD POST: ', data);
    return data;
  },
  async get(no) {
    const { data } = await api.get(`${BASE_URL}/${no}`);
    console.log('BOARD GET', data);
    return data;
  },
  async delete(no) {
    const { data } = await api.delete(`${BASE_URL}/${no}`);
    console.log('BOARD DELETE: ', data);
    return data;
  },
};
