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
      return `<form action="/review/delete?r=${reviewId}" method="POST" class="mr-auto">
      <input type="hidden" name="_method" value="DELETE">
      <button type="button" class="btn btn-outline-info btn-sm" style="font-size:medium; border: none" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal${reviewId}">
      <i class="far fa-trash-alt fa-lg"></i>
      </button>
      <div class="modal fade" id="confirmDeleteModal${reviewId}" tabindex="-1">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Delete</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        Are you sure you want to delete?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-danger">Delete</button>
      </div>
      </div>
      </div>
      </div>
      </form>`;
    } else {
      return "";
    }
  },
  deleteComment: (commentUserId, loggedUserId, reviewId, commentId) => {
    console.log(commentId);
    if (commentUserId.toString() == loggedUserId.toString()) {
      return `<form action="/review/comment/delete?id=${commentId}&r=${reviewId}" method="POST" class="ml-5">
      <input type="hidden" name="_method" value="PUT">
      <button type="button" class="btn btn-outline-info btn-sm" style="font-size:medium; border: none" data-bs-toggle="modal" data-bs-target="#confirmDelete${commentId}">
      <i class="far fa-trash-alt fa-lg"></i>
      </button>
      <div class="modal fade" id="confirmDelete${commentId}" tabindex="-1">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Delete</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        Are you sure you want to delete?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-danger">Delete</button>
      </div>
      </div>
      </div>
      </div>
      </form>`;
    } else {
      return "";
    }
  },
  formatDate: (date) => {
    return new Date(date).toLocaleDateString("en-gb", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
  userNamePick: (local, google) => {
    return local || google;
  },
};
