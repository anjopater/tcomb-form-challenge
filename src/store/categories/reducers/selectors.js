export default function(globalState) {
    const state = globalState.categories;
  
    const getCategories = () => state.categories;
    const getFetchStatus = () => state.fetchStatus;
    const getUpdateStatus = () => state.updateStatus;
  
    return {
      getCategories,
      getFetchStatus,
      getUpdateStatus
    };
}
  