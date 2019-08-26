const parser = new Parser({ schema, values: {}, mode: 'create' });

const form = new Form();


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('uischema').appendChild(document.createTextNode(JSON.stringify(schema, null, 4)));

    document.getElementsByClassName('south')[0].append(form.render({ values: parser.getValues(), schema, onChange: renderForm }));

}, false);

function renderForm(changed = {}) {

    document.getElementsByClassName('south')[0].append(form.render({ values: parser.getValues(changed), schema, onChange: renderForm }));

    document.getElementsByClassName('south')[0].firstChild.remove();
}