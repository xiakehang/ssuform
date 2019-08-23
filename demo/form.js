const form = class {
    constructor () {}
    render (props) {

        const {schema = {}, values = {}} = props;

        const fields = schema.fields || [];

        const form = document.createElement('div');

        let inner = '';

        Object.keys(values).forEach(key => {
            const field = fields.find(f => f.name === key);
            inner += `<p><label>${field.label}: </label><input value=${values[key]}></input></p>`;

        });

        form.innerHTML = inner;

        return form;
    }
}