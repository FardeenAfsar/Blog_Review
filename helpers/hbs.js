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
      return `<a href="/review/edit?r=${reviewId}" class="btn btn-outline-info btn-sm" style="font-size:medium; border: none"><i
      class="far fa-edit fa-lg"></i></a>`;
    } else {
      return "";
    }
  },
};
