import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CategoryList from '../../containers/CategoryList';

class Main extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route path="/CategoryList" component={CategoryList} />
                </Switch>
            </main>
        );
    }

};

export default Main;

