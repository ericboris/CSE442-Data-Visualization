import React, { useState } from 'react';
import { Container, Form, Row } from 'react-bootstrap';
import { NumberField, ReadOnlyTextField, TextAreaField } from './Fields';
import { MineButton } from './MineButton';
import MineSettings from './MineSettings';
import { sha256 } from 'js-sha256';
import { SwitchButton } from './Switch';
import DefaultBlocks from './DefaultBlocks';
import {RED, GREEN, BORDER_RED, BORDER_GREEN} from './ColorSettings';

// Parse the mining settings.
const difficulty = MineSettings.difficulty;
const pattern = MineSettings.pattern;

// Define component globals.                                                      
/*
const GREEN = '#90be6d';
const RED = '#F9844A';
const redBORDER = '#F9C74F';
const greenBORDER = '#4D908E';
*/

const defaultBlock = DefaultBlocks.block0;

function Block() {
    const [block, setBlock] = useState(defaultBlock);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const {blockNumber, nonce, data} = block;
    const hash = () => sha256(blockNumber + nonce + data);
    const isSigned = () => hash().substr(0, difficulty) === pattern;

    return (
        <Container
            style={{
                'width':350,
                'height':455,
                'backgroundColor':isSigned() ? GREEN : RED,
                'border': '3px solid',
                'borderColor': isSigned() ? BORDER_GREEN : BORDER_RED, 
            }}
        >
            <Form>
                <NumberField
                    label={'Block Number:'}
                    value={blockNumber}
                    callback={(blockNumber) => setBlock({...block, blockNumber})}
                />
                <NumberField
                    label={'Nonce:'}
                    value={nonce}
                    callback={(nonce) => setBlock({...block, nonce})}
                />
                <TextAreaField
                    label={'Data:'}
                    callback={(data) => setBlock({...block, data})}
                />
                <ReadOnlyTextField
                    label={'Hash:'}
                    value={hash()}
                />
                <br />
                <Row className="g-2">
                    <MineButton
                        blockNumber={blockNumber}
                        data={data}
                        block={block}
                        setBlock={setBlock}
                        isSwitchOn = {isSwitchOn}
                    />
                    <SwitchButton
                        isSwitchOn = {isSwitchOn}
                        setIsSwitchOn={setIsSwitchOn}
                    />
                </Row>
            </Form>
        </Container>
    );
}

export default Block;
