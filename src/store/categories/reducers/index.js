import { combineReducers } from 'redux';
import ShortUniqueId from 'short-unique-id';
import at from '../actions/types';


const uid = new ShortUniqueId();
const defaultState = [];

export const categories = (state = defaultState, action) => {
    switch (action.type) {
        case at.FETCH_REQUEST:
        case at.FETCH_FAILURE: {
            return defaultState;
        }
        case at.FETCH_SUCCESS: {
            const categoriesList = localStorage.getItem("categories");
            if (categoriesList) {
                return JSON.parse(categoriesList);
            } else {
                const cat = [{ id: 1, name: 'Device Info', attributes: [] }, { id: 2, name: 'Sensors', attributes: [] }, { id: 3, name: 'Settings', attributes: [] }, { id: 4, name: 'Commands', attributes: [] }, { id: 5, name: 'Metadata', attributes: [] }];
                localStorage.setItem('categories', JSON.stringify(cat));
                return JSON.parse(localStorage.getItem('categories'));
            }
        }
        case at.UPDATE_SUCCESS: {
            const { attribute } = action;

            const categories = state.map((category) => {
                if (attribute.categoryId === category.id) {
                    const attributes = category.attributes.concat([{ id: uid.randomUUID(6), data: attribute.value }]);
                    return Object.assign({}, category, {
                        attributes: attributes
                    });
                } else {
                    return category;
                }
            });
            localStorage.setItem('categories', JSON.stringify(categories));
            return categories;
        }

        case at.REMOVE_ATTRIBUTE_SUCCESS: {
            const { data } = action;

            const categories = state.map((category) => {
                if (category.id === data.activeCategoryId) {
                    const newAttributes = category.attributes.filter(a => a.id !== data.attributeId);
                    return Object.assign({}, category, {
                        attributes: newAttributes
                    });
                } else {
                    return category;
                }
            });
            localStorage.setItem('categories', JSON.stringify(categories));
            return categories;
        }
        default:
            return state;
    }
};

export const fetchStatus = (state = 'notLoaded', action) => {
    switch (action.type) {
        case at.FETCH_REQUEST: {
            return 'loading';
        }
        case at.FETCH_SUCCESS: {
            return 'loaded';
        }
        case at.FETCH_FAILURE: {
            return 'failed';
        }
        default:
            return state;
    }
};

export const updateStatus = (state = 'notUpdated', action) => {
    switch (action.type) {
        case at.UPDATE_REQUEST: {
            return 'updating';
        }
        case at.UPDATE_SUCCESS: {
            return 'updated';
        }
        case at.UPDATE_FAILURE: {
            return 'failed';
        }
        default:
            return state;
    }
};

export default combineReducers({ categories, fetchStatus, updateStatus });