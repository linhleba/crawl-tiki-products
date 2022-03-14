import callAPI from '../utils/apiCaller.js';

export const getAuthor = async () => {
  let result;
  await callAPI('api/author', 'get', null).then((res) => {
    result = res.data;
  });
  return result;
};

export const getCategory = async () => {
  let result;
  await callAPI('api/category', 'get', null).then((res) => {
    result = res.data;
  });
  return result;
};

export const checkAuthorExistence = async (authorList, author) => {
  let authorId = -1;
  Promise.all(
    authorList.map((item) => {
      if (item.name == author) {
        authorId = item.id;
      }
    }),
  );
  // handle if not existed id in database
  if (authorId == -1) {
    let payload = {
      name: author,
      telephone: '',
    };
    await callAPI('api/author', 'post', payload).then((res) => {
      console.log('author', res);
      authorId = res.data.id;
    });
  }
  return authorId;
};

export const checkCategoryExistence = async (categoryList, category) => {
  let categoryId = -1;
  Promise.all(
    categoryList.map((item) => {
      if (item.name == category) {
        categoryId = item.id;
      }
    }),
  );
  // handle if not existed id in database
  if (categoryId == -1) {
    await callAPI('api/category', 'post', { name: category }).then((res) => {
      categoryId = res.data.id;
    });
  }
  return categoryId;
};
