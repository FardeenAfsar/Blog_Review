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
      // if (currentPage > 3 && pages > 5)
      // 1 - page display (max 5)
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
};
