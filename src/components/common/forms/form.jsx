import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import TextArea from "./textarea";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import _ from "lodash";

class Form extends Component {
    state = {
        data: {},
        errors: {},
    };

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.data, this.schema, options);
        if (!error) return null;

        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        //console.log("validate errors...", errors);
        return errors;
    };

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        // console.log("obj", obj);
        if (name.includes("[")) return null;
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleSubmit = (e) => {
        console.log("handle submit");
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.doSubmit();
    };

    handleChange = ({ currentTarget: input }, onChangeHandler) => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const data = { ...this.state.data };
        //data[input.name] = input.value;

        _.set(data, input.name, input.value);
        this.setState({ data, errors });

        onChangeHandler && onChangeHandler(input.value);
    };
    handleSelectSingleChoice = (name, value, onChangeHandler) => {
        const data = { ...this.state.data };
        data[name] = value;

        this.setState({ data });

        onChangeHandler && onChangeHandler(value);
    };
    handleChangeCheckbox = (name, value, onChangeHandler) => {
        const data = { ...this.state.data };
        data[name] = value;

        this.setState({ data });

        onChangeHandler && onChangeHandler(value);
    };

    renderButton(label) {
        return (
            <button disabled={this.validate()} className="btn btn-primary">
                {label}
            </button>
        );
    }

    renderSelect(name, label, options) {
        const { data, errors } = this.state;

        return (
            <Select
                name={name}
                value={data[name]}
                label={label}
                options={options}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }
    renderCheckBox(name, label, type = "text", handlers) {
        if (!handlers) handlers = {};
        return (
            <div className="form-group">
                <label style={{ fontWeight: "regular", marginRight: 10 }}>{label}</label>

                <ButtonGroup className="mb-2">
                    <Button
                        onClick={() => this.handleChangeCheckbox(name, false)}
                        variant={this.state.data[name] === false ? "danger" : "secondary"}
                    >
                        false
                    </Button>
                    <Button
                        onClick={() => this.handleChangeCheckbox(name, true)}
                        variant={this.state.data[name] === true ? "success" : "secondary"}
                    >
                        true
                    </Button>
                </ButtonGroup>
            </div>
        );
    }

    renderSingleChoice(name, label, options, handlers) {
        if (!handlers) handlers = {};
        return (
            <div className="form-group">
                <label style={{ fontWeight: "regular", marginRight: 10 }}>{label}</label>

                <ButtonGroup className="mb-2">
                    {options.map((x) => {
                        return (
                            <Button
                                key={x.name}
                                onClick={() => this.handleSelectSingleChoice(name, x.name)}
                                variant={this.state.data[name] === x.name ? "primary" : "secondary"}
                            >
                                {x.label}
                            </Button>
                        );
                    })}
                </ButtonGroup>
            </div>
        );
    }

    renderInput(name, label, type = "text", handlers) {
        const { data, errors } = this.state;
        let state_pointer = _.get(data, name);

        if (!handlers) handlers = {};
        return (
            <Input
                type={type}
                name={name}
                value={state_pointer}
                label={label}
                onChange={(currentTarget) =>
                    this.handleChange(currentTarget, handlers.handleTextChanged)
                }
                onFocus={handlers.handleFocus ? handlers.handleFocus : undefined}
                onBlur={handlers.handleBlur ? handlers.handleBlur : undefined}
                error={errors[name]}
            />
        );
    }
    renderTextArea(name, label, type = "text", handlers) {
        const { data, errors } = this.state;
        if (!handlers) handlers = {};
        return (
            <TextArea
                type={type}
                name={name}
                value={data[name]}
                label={label}
                onChange={(currentTarget) =>
                    this.handleChange(currentTarget, handlers.handleTextChanged)
                }
                onFocus={handlers.handleFocus ? handlers.handleFocus : undefined}
                onBlur={handlers.handleBlur ? handlers.handleBlur : undefined}
                error={errors[name]}
            />
        );
    }
}

export default Form;
