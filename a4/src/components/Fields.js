import { Form } from 'react-bootstrap';

// Return the component title as a header.
function TitleField({titleText}) {
    return (
        <h2>
            {titleText}
        </h2>
    );
};

// TODO
function SecondTitleField({titleText}) {
    return (
        <h4>
            {titleText}
        </h4>
    );
};

// Return the component body as a list of paragraphs separated by newlines.
function BodyField({bodyText}) {
    return (
        <div>
            {bodyText.split('\n\n').map(paragraph =>
            <p>
                {paragraph.split('\n').reduce((total, line) => [total, <br />, line])}
            </p>
            )}
        </div>
    );
};

// TODO
function NumberField({label, value, callback}) {
    return (
        <Form.Group>
            <Form.Label>
                {label}
            </Form.Label>
            <Form.Control
                type="number"
                onChange={(event) => {
                    callback(event.target.value);
                    event.preventDefault();
                }}
                value={value}
            />
        </Form.Group>
    );
};

// TODO
function TextAreaField({label, callback}) {
   return (
        <Form.Group>
            <Form.Label>
                {label}
            </Form.Label>
            <Form.Control
                as="textarea"
                type="text"
                placeholder=""
                onChange={(event) => {
                    callback(event.target.value);
                }}
            />
        </Form.Group>
    );
};

// TODO
function ReadOnlyTextField({label, value, callback}) {
    return (
        <Form.Group>
            <Form.Label>
                {label}
            </Form.Label>
            <Form.Control
                    readOnly
                type="text"
                onChange={(event) => {
                    callback(event.target.value);
                }}
                value={value}
            />
        </Form.Group>
    );
};

export { BodyField, ReadOnlyTextField, TitleField, SecondTitleField, NumberField, TextAreaField }
