const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h)=>{
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();

  if (!name){
    return h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount){
    return h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished,
    reading, insertedAt, updatedAt: insertedAt
  };

  books.push(newBook);

  return h.response({
    'status': 'success',
    'message': 'Buku berhasil ditambahkan',
    data: {
      bookId: id
    }
  }).code(201);
};

const getAllBooksHandler = (request, h)=>{
  const { name, reading, finished } = request.query;

  let booksAll = [...books];

  if (name){
    booksAll = booksAll.filter((b) => {
      const bookName = b.name;
      return bookName.toLowerCase().includes(name.toLowerCase());
    });
  }

  if (reading !== undefined){
    booksAll = booksAll.filter((b) => b.reading === Boolean(+reading));
  }

  if (finished !== undefined){
    booksAll = booksAll.filter((b) => b.finished === Boolean(+finished));
  }

  booksAll = booksAll.map((book) =>({
    id: book.id, name: book.name, publisher: book.publisher
  }));

  return h.response({
    status: 'success',
    data: {
      books: booksAll
    }
  });
};

const getBookByIdHandler = (request, h)=>{
  const { id } = request.params;
  const book = books.find((b) => b.id === id);

  if (!book){
    return h.response({
      'status': 'fail',
      'message': 'Buku tidak ditemukan'
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book: book
    }
  });
};

const editBookByIdHandler = (request, h)=>{
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload;

  if (!name){
    return h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount){
    return h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  const index = books.findIndex((b) => b.id === id);

  if (index === -1){
    return h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);
  }

  books[index] = {
    ...books[index],
    name, year, author, summary, publisher, pageCount, readPage, finished: pageCount === readPage,
    reading, updatedAt: new Date().toISOString(),
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  });
};

const deleteBookByIdHandler = (request, h)=>{
  const { id } = request.params;

  const index = books.findIndex((b) => b.id === id);

  if (index === -1){
    return h.response({
      'status': 'fail',
      'message': 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  });
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler
};