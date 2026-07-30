import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min';
import '../node_modules/glyphicons/glyphicons';
import './styles/styles';
import "react-datepicker/dist/react-datepicker.css";
import App from './App';
import history from "./utils/history";
import store from "./store/store";

import {Provider} from "react-redux";
import {Route, Router} from "react-router-dom";

const app = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}/>
        </Router>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

