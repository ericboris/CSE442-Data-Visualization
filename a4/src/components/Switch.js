import { Form } from 'react-bootstrap';

function SwitchButton({isSwitchOn, setIsSwitchOn}) {
    const onSwitchAction = () => {
        setIsSwitchOn(!isSwitchOn);
      };

    return (
        <Form>
        <Form.Check
            onChange={() => onSwitchAction()}
            type="switch"
            id="custom-switch"
            style={{ color: "white", fontSize: "16pt"}}
            label="Visualize!" 
        />
        </Form>
    );
};

export { SwitchButton }
