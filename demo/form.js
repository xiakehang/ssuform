const Form = class {
    // constructor() {}
    render(props) {

        const { schema = {}, values = {}, onChange = () => {} } = props;

        const fields = schema.fields || [];

        const form = document.createElement('div');

        form.className = 'auto-form';

        let inner = '';

        Object.keys(values).forEach(key => {
            const field = fields.find(f => f.name === key);
            inner += `<p><label>${field.label}: </label><input name="${field.name}" value=${values[key] || ''}></input></p>`;

        });

        form.innerHTML = inner;

        form.querySelectorAll('input').forEach(f => {
            f.onkeyup = function(e) {
                if (e.target.value !== values[e.target.name]) {
                    // re-calc and render
                    onChange({
                        [e.target.name]: e.target.value
                    });
                }
            }
        });


        return form;
    }
}