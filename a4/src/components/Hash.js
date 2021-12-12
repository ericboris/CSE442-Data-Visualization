import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { sha256 } from 'js-sha256';
import { ReadOnlyTextField, TextAreaField } from './Fields';

const BLOCK_WIDTH = 400;                                                           
const BLOCK_HEIGHT = 190;  
const BLOCK_COLOR = '#EEEEEE';

function Hash(props) {
    const [data, setData] = useState("");
    const hash = () => sha256(data);

    return (
        <Container 
            style={{ 
                'width':BLOCK_WIDTH,
                'height':BLOCK_HEIGHT,
                'backgroundColor':BLOCK_COLOR,
            }}
        >
            <Form>
                <TextAreaField 
                    label={'Data:'}
                    callback={(data) => setData(data)}
                />
                <ReadOnlyTextField 
                    label={'Hash:'} 
                    value={hash()} 
                />    
            </Form>
        </Container>
    );
}

export default Hash;
