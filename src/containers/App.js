import { connect } from 'react-redux';
import { categoriesActions, categoriesSelectors } from '../store/categories';
import { App } from '../components';
import { withRouter } from 'react-router-dom';

function mapStateToProps(state) {
  const categories = categoriesSelectors(state);
  return {
    categories: categories.getCategories(),
    categoriesFetchStatus: categories.getFetchStatus(),
    categoriesUpdateStatus: categories.getUpdateStatus()
  };
}

export default withRouter(connect(mapStateToProps, {
  fetchCategories: categoriesActions.fetch,
  updateCategories: categoriesActions.update,
  removeAttribute: categoriesActions.remove
})(App));
