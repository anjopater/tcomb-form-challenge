import at from './types';

export const fetch = () => ({type: at.FETCH_REQUEST});
export const update = (data) => ({type: at.UPDATE_REQUEST, data});
export const remove = (data) => ({type: at.REMOVE_ATTRIBUTE_REQUEST, data});
