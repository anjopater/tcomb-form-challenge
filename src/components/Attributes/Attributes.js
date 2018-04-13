import React, { Component } from 'react';
import { Table, Icon, Checkbox, Button, Accordion } from 'semantic-ui-react';
import t from 'tcomb-form';
import InputAttribute from '../InputAttribute';
import TagsComponent from '../TagsComponent';
import PropTypes from 'prop-types';
import './Attributes.css'

let formLayout = function (locals) {
  return (
    <div>
      <div>{locals.inputs.name}</div>
      <div>{locals.inputs.description}</div>
      <div>{locals.inputs.deviceResourceType}</div>
      <div>{locals.inputs.defaultValue}</div>
      <div>{locals.inputs.datatype}</div>
      <div>{locals.inputs.format}</div>
      <div>
        {locals.inputs.tags && (
          <div>
            <label htmlFor="">Enumerations</label>
            <div>{locals.inputs.tags}</div>
          </div>
        )}
        {locals.inputs.rangeMin && (
          <div>
            <div>{locals.inputs.rangeMin}</div>
            <div>{locals.inputs.rangeMax}</div>
            <div>{locals.inputs.unitOfMeasurement}</div>
            <div>{locals.inputs.precision}</div>
            <div>{locals.inputs.accuracy}</div>
          </div>
        )}
      </div>
    </div>
  );
};

let enumerationLayout = function (locals) {
  return (
    <div>
      <div>{locals.items}</div>
    </div>
  );
};


class Attributes extends React.PureComponent {
  constructor(props) {
    super(props);

    //field options
    const deviceResorceType = t.enums.of(['type 1', 'type 2', 'other'], 'AccountType');
    const DataType = t.enums.of(['STRING', 'OBJECT'], 'DataType');
    const Format = t.enums.of([], 'Format');
    const Name = t.refinement(t.String, (n) => {
      const exist = this.state.attributes.filter((attribute) => { return n === attribute.name }).length === 0;
      return exist;
    });

    this.state = {
      attributes: [],
      enumerations: ['uno', 'dos'],
      fieldOptions: {
        template: formLayout,
        fields: {
          name: {
            label: 'Name'
          },
          decription: {
            label: 'Description'
          },
          deviceResourceType: {
            label: 'Device Resource type',
            disabled: true
          },
          defaultValue: {
            label: 'Default Value'
          },
          datatype: {
            label: 'Data Type'
          },
          format: {
            label: 'Format'
          },
          tags: {
            factory: TagsComponent,
            disabled: true
          }
        }
      },
      model: t.struct({
        name: Name,
        description: t.maybe(t.String),
        deviceResourceType: t.maybe(deviceResorceType),
        defaultValue: t.maybe(t.String),
        datatype: t.maybe(DataType),
        format: t.maybe(Format),
        tags: t.list(t.String) // a list of strings
      }),
      activeIndex: 0
    }

    this.onRemoveAttribute = this.onRemoveAttribute.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.attributes !== nextProps.attributes) {
      this.setState({ attributes: nextProps.attributes });
    }
  }

  componentDidMount = () => {
    this.setState({ attributes: this.props.attributes });
  }

  onSave = (value) => {
    const { updateCategories, activeCategoryId } = this.props;
    updateCategories({ categoryId: activeCategoryId, value });
  };

  onSetFieldOptions = (newOptions) => {
    this.setState({ fieldOptions: { ...this.state.fieldOptions, fields: newOptions, template: formLayout } });
  };

  onSetModelOptions = (newModel) => {
    this.setState({ model: newModel });
  };

  onRemoveAttribute = (attributeId) => (event) => {
    const { removeAttribute, activeCategoryId } = this.props;
    removeAttribute({ attributeId: attributeId, activeCategoryId: activeCategoryId });
  }

  handleClickAccordion = (e, titleProps) => {
    const { activeIndex } = this.state;
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex });
  };

  render() {
    const attributesList = this.state.attributes.map((attribute, index) => {
      return (
        <div key={attribute.id} id={attribute.id}>
          <Accordion.Title active={this.state.activeIndex === index} index={index} onClick={this.handleClickAccordion}>
            <Icon name='dropdown' />
            <span className="capitalize">{attribute.data.name}</span> - <span>{attribute.data.description}</span>
            <Icon className="icon-delete float-right" name='delete' onClick={this.onRemoveAttribute(attribute.id)} />
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === index}>
            <pre>
              {JSON.stringify(attribute.data, undefined, 2)}
            </pre>
          </Accordion.Content>
        </div>
      )
    });

    return (
      <div>
        <Accordion fluid styled className="accordion-attribute">
          {attributesList}
        </Accordion>
        <InputAttribute
          model={this.state.model}
          options={this.state.fieldOptions}
          save={this.onSave}
          onSetFieldOptions={this.onSetFieldOptions}
          onSetModelOptions={this.onSetModelOptions}
          formLayout={formLayout}
          attributes={this.state.attributes} />
      </div>
    )
  }
}

Attributes.propTypes = {
  attributes:PropTypes.array.isRequired,
  updateCategories: PropTypes.func.isRequired,
  removeAttribute: PropTypes.func.isRequired,
  activeCategoryId: PropTypes.number.isRequired
};

export default Attributes;