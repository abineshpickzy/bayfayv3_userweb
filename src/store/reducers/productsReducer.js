import {
    CATEGORIES_FETCH_SUCCESS,
    CLEAR_PRODUCTS,
    FETCH_PREVIOUS_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_COUNT_SUCCESS,
    FETCH_PRODUCTS_ERROR,
    FETCH_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_TEMPLATE_ERROR,
    PRODUCT_DETAILS_TEMPLATE_SUCCESS,
    REMOVE_FIRST_50_PRODUCTS,
    REMOVE_LAST_50_PRODUCTS, RESET_SCROLL_CATEGORY,
    REVIEW_FETCH_SUCCESS
} from "../actionTypes/products-actions";

const initialState = {
    products: new Map(),
    productsCount: 0,
    offerProductsCount: null,
    reviews: new Map(),
    error: null,
    categories: [],
    productsImages: {},
    productDetailsTemplate: null,
    scrollToCategory: null
};

const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_SUCCESS:
            return fetchProductsSuccess(state, action);
        case FETCH_PREVIOUS_PRODUCTS_SUCCESS:
            return fetchPreviousProductsSuccess(state, action);
        case FETCH_PRODUCTS_ERROR:
            return fetchProductsError(state, action);
        case CLEAR_PRODUCTS:
            return clearProducts(state);
        case FETCH_PRODUCTS_COUNT_SUCCESS:
            return fetchProductsCountSuccess(state, action);
        case REVIEW_FETCH_SUCCESS:
            return fetchReviewSuccess(state, action);
        case CATEGORIES_FETCH_SUCCESS:
            return categoriesFetchSuccess(state, action);
        case PRODUCT_DETAILS_TEMPLATE_SUCCESS:
            return productDetailsTemplateSuccess(state, action);
        case PRODUCT_DETAILS_TEMPLATE_ERROR:
            return productDetailsTemplateError(state);
        case REMOVE_FIRST_50_PRODUCTS:
            return removeFirst50Products(state);
        case REMOVE_LAST_50_PRODUCTS:
            return removeLast50Products(state);
        case RESET_SCROLL_CATEGORY:
            return {
                ...state,
                scrollToCategory: null
            };
        default:
            return state;
    }
};

const removeLast50Products = state => {
    const products = new Map(state.products);
    let deletedProducts = 0;
    const removeProductCount = 50;
    Array.from(products).reverse().forEach(([key, value]) => {
        if (deletedProducts < 50) {
            const needToDelete = removeProductCount - deletedProducts;
            if (products.get(key).category.length <= needToDelete) {
                products.delete(key);
                deletedProducts += value.category.length;
            } else {
                const prods = [...products.get(key).category];
                const newProds = prods.slice(needToDelete, prods.length);
                deletedProducts += needToDelete;
                products.set(key, {...value, category: [...newProds]});
            }
        }
    });
    return {
        ...state,
        products
    };
};

const removeFirst50Products = state => {
    const products = new Map(state.products);
    let deletedProducts = 0;
    const removeProductCount = 50;
    Array.from(products).forEach(([key, value]) => {
        if (deletedProducts < 50) {
            const needToDelete = removeProductCount - deletedProducts;
            if (products.get(key).category.length <= needToDelete) {
                products.delete(key);
                deletedProducts += value.category.length;
            } else {
                const prods = [...products.get(key).category];
                const newProds = prods.slice(needToDelete, prods.length);
                deletedProducts += needToDelete;
                products.set(key, {...value, category: [...newProds]});
            }
        }
    });
    return {
        ...state,
        products
    };
};

const fetchPreviousProductsSuccess = (state, action) => {
    const oldProducts = new Map(state.products);
    const products = new Map();
    action.payload.data.forEach(p => {
        // p = {_id, category_name, category= []}
        const categoryName = getCategoryName(p);
        if (oldProducts.has(categoryName)) {
            const old = oldProducts.get(categoryName);
            oldProducts.set(categoryName, {...old, category: [...p.category, ...old.category]});
        } else {
            products.set(categoryName, p);
        }
    });
    const scrollToCategory = oldProducts.keys().next().value;
    Array.from(oldProducts).forEach(([key, value]) => {
        products.set(key, value);
    });
    return {
        ...state,
        products,
        scrollToCategory
    };
};

const fetchProductsSuccess = (state, action) => {
    const products = new Map(state.products);
    action.payload.data.forEach(p => {
        const categoryName = getCategoryName(p);
        if (products.has(categoryName)) {
            const categoryProducts = products.get(categoryName);
            categoryProducts.category.push(...p.category);
        } else {
            products.set(categoryName, p);
        }
    });
    return {
        ...state,
        products,
        error: null,
        scrollToCategory: null
    }
};

const getCategoryName = (p) => {
    const cats = p.category_name.split('\/').filter(c => c.toString().trim().length > 0);
    let categoryName;
    if (cats.length === 1) {
        categoryName = cats[0];
    } else {
        categoryName = cats.join(' > ');
    }
    return categoryName;
};

const fetchProductsError = (state, action) => {
    return {
        ...state,
        products: [],
        error: action.payload,
        productsCount: 0
    }
};

const fetchProductsCountSuccess = (state, action) => {
    let productsCount = 0;
    let offerProductsCount = 0;
    if (action.payload?.data?.total) {
        productsCount = action.payload.data.total;
    }
    if (action.payload?.data?.offer_prod_count) {
        offerProductsCount = action.payload.data.offer_prod_count;
    }
    return {
        ...state,
        productsCount,
        offerProductsCount
    };
};

const clearProducts = state => {
    return {
        ...state,
        products: new Map(),
        productsCount: 0
    }
};

const fetchReviewSuccess = (state, action) => {
    const reviews = new Map(state.reviews);
    reviews.set(action.payload.productId, action.payload.review);
    return {
        ...state,
        reviews,
    };
};

const categoriesFetchSuccess = (state, action) => {
    const categoriesPayload = action.payload.data.category;
    const categories = [];
    categoriesPayload.forEach(c => {
        const cats = c.split('\/');
        c = categories;
        let parent = '';
        for (let i = 0; i < cats.length; i++) {
            if (i > 0 && cats[i - 1].length > 0) {
                parent += `/${cats[i - 1]}`
            }
            if (cats[i].length === 0) continue;
            let temp = c.find(t => t.name === cats[i]);
            if (!temp) {
                temp = {parent, name: cats[i], children: []};
                c.push(temp);
            }
            c = temp.children;
        }
    });
    return {
        ...state,
        categories
    };
};

const productDetailsTemplateSuccess = (state, action) => {
    return {
        ...state,
        productDetailsTemplate: action.payload.data
    };
};

const productDetailsTemplateError = state => {
    return {
        ...state,
        productDetailsTemplate: null
    }
};

export default productsReducer;
