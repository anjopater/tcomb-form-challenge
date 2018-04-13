import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';
import t from 'tcomb-form';
import PropTypes from 'prop-types';

const Form = t.form.Form;

class InputAttribute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: {
                name: '',
                description: '',
                datatype: '',
                format: '',
                tags: []
            },
            showMessageError: false
        }
        this.onSave = this.onSave.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = (value, path) => {
        const { onSetFieldOptions, onSetModelOptions } = this.props;
        const fieldName = path[0];
        const val = this.refs.form.getComponent(path).state.value;
        const validationStruct = this.refs.form.getComponent(path).validate();
        this.setState({ showMessageError: false });
        const newOptions = [this.props.options.fields].filter((item) => {
            if (validationStruct.errors.length > 0 || path[0] === 'rangeMin' || path[0] === 'rangeMax' || path[0] === 'precision' || path[0] === 'accuracy') {
                const newProperty = { ...item[fieldName], hasError: true, error: this.getValidationMessage(path[0], value) };
                item[fieldName] = newProperty;
            } else {
                const newProperty = { ...item[fieldName], hasError: false, error: undefined };
                item[fieldName] = newProperty;
            }
            return item;
        });

        onSetFieldOptions({ ...newOptions[0] });
        this.setState({ value: value });

        if (value.datatype === 'STRING') {
            let model = this.getModel('STRING');
            onSetModelOptions(model);

            if (value.format === 'NONE') {
                var options = t.update(this.props.options.fields, {
                    tags: {
                        disabled: { '$set': false }
                    }

                });
                onSetFieldOptions(options);
            } else if (value.format === 'NUMBER') {

                const newFields = {
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
                    rangeMin: {
                        label: 'Range'
                    },
                    rangeMax: {
                        label: ''
                    },
                    unitOfMeasurement: {
                        label: 'Unit of Measurement'
                    },
                    precision: {
                        label: 'Precision'
                    },
                    accuracy: {
                        labe: 'Accuracy'
                    }
                };

                var options = t.update(this.props.options, {
                    fields: {
                        $set: newFields
                    }
                });


                let model = this.getModel('STRING', 'NUMBER');

                onSetModelOptions(model);
            } else if (value.format === 'BOOLEAN' || value.format === 'DATE-TIME' || value.format === 'CDATA') {
                let model = this.getModel(value.format);
                onSetModelOptions(model);
            }

        } else if (value.datatype === 'OBJECT') {
            var options = t.update(this.props.options.fields, {
                format: {
                    disabled: { '$set': true }
                }

            });
            onSetFieldOptions(options);
            let model = this.getModel('OBJECT');
            onSetModelOptions(model);
        }

    }

    onSave() {
        const { save } = this.props;
        var value = this.refs.form.getValue();
        // console.log(value);
        if (value) {
            save(value);
            this.setState({
                value: {
                    name: '',
                    description: '',
                    tags: []
                }
            });
            this.setState({ showMessageError: false });
        } else {
            this.setState({ showMessageError: true });
        }
    }

    getModel = (dataType, format) => {
        //field options
        let DeviceResourceType = t.enums.of(['type 1']);
        let DataType = t.enums.of(['STRING', 'OBJECT'], 'DataType');
        let Format = t.enums.of([], 'Format');
        let Name = t.refinement(t.String, (n) => {
            const exist = this.props.attributes.filter((attribute) => { return n === attribute.name }).length === 0;
            return exist;
        });

        if (dataType === 'STRING' && format === undefined) {
            Format = t.enums.of(['NONE', 'NUMBER', 'BOOLEAN', 'DATE-TIME', 'CDATA', 'URI'], 'Format');
            return t.struct({
                name: Name,
                description: t.maybe(t.String),
                deviceResourceType: t.maybe(DeviceResourceType),
                defaultValue: t.maybe(t.String),
                datatype: DataType,
                format: Format,
                tags: t.list(t.String) // a list of strings
            });
        } else if (dataType === 'STRING' && format === 'NUMBER') {
            const number = t.refinement(t.Number, (n) => {
                isNaN(n) ? false : true
            });
            Format = t.enums.of(['NONE', 'NUMBER', 'BOOLEAN', 'DATE-TIME', 'CDATA', 'URI'], 'Format');
            return t.struct({
                name: Name,
                description: t.maybe(t.String),
                deviceResourceType: t.maybe(DeviceResourceType),
                defaultValue: t.maybe(t.String),
                datatype: DataType,
                format: Format,
                rangeMin: t.Number,
                rangeMax: t.Number,
                unitOfMeasurement: t.String,
                precision: t.Number,
                accuracy: t.Number,
            });
        } else if (dataType === 'BOOLEAN' || dataType === 'DATE-TIME' || dataType === 'CDATA') {
            Format = t.enums.of(['NONE', 'NUMBER', 'BOOLEAN', 'DATE-TIME', 'CDATA', 'URI'], 'Format');
            return t.struct({
                name: Name,
                description: t.maybe(t.String),
                deviceResourceType: t.maybe(DeviceResourceType),
                defaultValue: t.maybe(t.String),
                datatype: DataType,
                format: Format
            });
        } else if (dataType === 'OBJECT') {
            Format = t.enums.of(['NONE', 'NUMBER', 'BOOLEAN', 'DATE-TIME', 'CDATA', 'URI'], 'Format');
            return t.struct({
                name: Name,
                description: t.maybe(t.String),
                deviceResourceType: t.maybe(DeviceResourceType),
                defaultValue: t.maybe(t.String),
                datatype: DataType,
                format: t.maybe(Format)
            });
        }
    }

    getValidationMessage = (field, value) => {
        switch (field) {
            case 'name':
                if (value.name.length > 0) {
                    return 'this name already exist!'
                } else {
                    return 'This field is required';
                }
                break;
            case 'rangeMin':
                if (isNaN(value.rangeMin)) {
                    return 'This field must be a number';
                } else
                    if (value.rangeMin.length === 0) {
                        return 'This field is required'
                    }
                break;
            case 'rangeMax':
                if (isNaN(value.rangeMax)) {
                    return 'This field must be a number';
                } else if (value.rangeMax.length === 0) {
                    return 'This field is required'
                }
                else if (value.rangeMax < value.rangeMin) {
                    return 'Range Max must be greater Range Min'
                }
                break;
            case 'unitOfMeasurement':
                if (value.unitOfMeasurement.length === 0) {
                    return 'This field is required'
                }
                break;
            case 'precision':
                if (isNaN(value.precision)) {
                    return 'This field must be a number';
                } else if (value.precision.length === 0) {
                    return 'This field is required';
                } else if (value.precision < value.rangeMin || value.precision > value.rangeMax) {
                    return 'Precision must be a value between Range Min and Range Max';
                }
                break;
            case 'accuracy':
                if (isNaN(value.accuracy)) {
                    return 'This field must be a number';
                } else if (value.accuracy.length === 0) {
                    return 'This field is required';
                } else if (value.accuracy < value.rangeMin || value.accuracy > value.rangeMax) {
                    return 'Precision must be a value between Range min and Range Max';
                }
        }
    };

    render() {
        const { model, options } = this.props;

        return (
            <div className="form-horizontal">
                {this.state.showMessageError && (
                    <Message negative>
                        <Message.Header>Sorry.. please review the field's form</Message.Header>
                        <p>Maybe you forget a field or is not correct.</p>
                    </Message>
                )}

                <Form
                    ref="form"
                    type={model}
                    options={options}
                    value={this.state.value}
                    onChange={this.onChange} />
                <Button
                    primary
                    size='small'
                    onClick={this.onSave}
                >
                    Add
                </Button>
            </div>
        )
    }
}


InputAttribute.propTypes = {
    onSetFieldOptions: PropTypes.func.isRequired,
    onSetModelOptions: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
};
export default InputAttribute;