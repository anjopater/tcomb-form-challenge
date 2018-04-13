import React, { Component } from 'react';
import { Button, Tab, Container, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Attributes from '../Attributes';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      activeCategoryId: 1
    }

    this.onTabChange = this.onTabChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.categories !== nextProps.categories) {
      this.setState({ categories: nextProps.categories });
    }
  }

  componentDidMount() {
    const { fetchCategories } = this.props;
    fetchCategories();
  }

  onTabChange = (event, data) => {
    this.setState({
      activeCategoryId: data.activeIndex + 1
    });
  };

  render() {
    const { categories, updateCategories, removeAttribute } = this.props;
    const categoriesList = this.state.categories.map((categorie, index) => {
      return {
        menuItem: categorie.name,
        render: () => {
          return <Tab.Pane key={index + categorie.id} id={categorie.id} name={categorie.name}>
            <p>here are many variations of passages of Lorem Ipsum available, but the
              majority have suffered alteration in some form, by injected humour, or
              randomised words which don't look even slightly believable. If you are going to
              use a passage of Lorem Ipsum, you need to be sure there isn't anything
              embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the
              Internet tend to repeat predefined chunks as necessary, making this the first
              true generator on the Internet. It uses a dictionary of over 200 Latin words,
              combined with a handful of model sentence structures, to generate Lorem Ipsum
              which looks reasonable. The generated Lorem Ipsum is therefore always free from
                repetition, injected humour, or non-characteristic words etc.</p>
            <Attributes
              attributes={categorie.attributes}
              updateCategories={updateCategories}
              activeCategoryId={this.state.activeCategoryId}
              removeAttribute={removeAttribute}
            />
          </Tab.Pane>
        }
      }
    });

    return (
      <Container>
        <Tab panes={categoriesList} onTabChange={this.onTabChange} />
      </Container>
    );
  }
}

App.propTypes = {
  categories: PropTypes.array,
  updateCategories: PropTypes.func,
  removeAttribute: PropTypes.func
};

export default App;