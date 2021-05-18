module.exports = {
  nextPage: (page) => {
    return parseInt(page) + 1;
  },
  prevPage: (page) => {
    return parseInt(page) - 1;
  },
  stringMatch: (s1, s2, options) => {
    return s1 == s2 ? options.fn(this) : options.inverse(this);
  },
  paginate: (currentPage, pages, options) => {
    let res = "";
    const activePage = currentPage;
    currentPage = Math.max(currentPage, 3);
    if (pages - currentPage < 2 && pages > 5) {
      currentPage = pages - 2;
    }
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i == activePage) {
        res += options.fn({
          page: i,
          activePage: true,
        });
      } else {
        res += options.fn({
          page: i,
          activePage: false,
        });
      }
      if (i == pages) {
        break;
      }
    }
    return res;
  },
  editBtn: (reviewUserId, loggedUserId, reviewId) => {
    if (reviewUserId.toString() == loggedUserId.toString()) {
      return `<a href="/review/edit?r=${reviewId}" class="btn btn-outline-info btn-sm mr-2" style="font-size:medium; border: none"><i
      class="far fa-edit fa-lg"></i></a>`;
    } else {
      return "";
    }
  },
  deleteBtn: (reviewUserId, loggedUserId, reviewId) => {
    if (reviewUserId.toString() == loggedUserId.toString()) {
      return `<form action="/review/delete?r=${reviewId}" method="POST" class="mr-auto"><input type="hidden" name="_method" value="DELETE"><button type="submit" class="btn btn-outline-info btn-sm" style="font-size:medium; border: none"><i class="far fa-trash-alt fa-lg"></i></button></form>`;
    } else {
      return "";
    }
  },
};
