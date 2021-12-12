import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import SingleBlock from './SingleBlock';
import DefaultBlocks from './DefaultBlocks';
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css';

function Blockchain({setLastHash=undefined}) {
    const [block1, setBlock1] = useState(DefaultBlocks.block1);
    const [block2, setBlock2] = useState(DefaultBlocks.block2);
    const [block3, setBlock3] = useState(DefaultBlocks.block3);
    const [block4, setBlock4] = useState(DefaultBlocks.block4);
    const [block5, setBlock5] = useState(DefaultBlocks.block5);

    const blockChainStyle = {
        width: '2000px',
        height: '550px',

    }

    // Update block2 prevHash to match block1 hash.
    useEffect(() => {
        setBlock2({...block2, prevHash: block1.hash});
        // eslint-disable-next-line
    }, [block1]);

    // Update block3 prevHash to match block2 hash.
    useEffect(() => {
        setBlock3({...block3, prevHash: block2.hash});
        // eslint-disable-next-line
    }, [block2]);

    // Update block4 prevHash to match block3 hash.
    useEffect(() => {
        setBlock4({...block4, prevHash: block3.hash});
        // eslint-disable-next-line
    }, [block3]);

    // Update block5 prevHash to match block4 hash.
    useEffect(() => {
        setBlock5({...block5, prevHash: block4.hash});
        // eslint-disable-next-line
    }, [block4]);

    // Update the caller's lastHash value.
    useEffect(() => {
        if (setLastHash !== undefined) {
            setLastHash(block5.hash);
        }
    }, [block5.hash, setLastHash]);


    return (
        <SimpleBar forceVisible="y" autoHide={true}>
            <div style={blockChainStyle}>
                <Container fluid>
                    <div className= "row justify-content-center" >
                        <SingleBlock
                            block={block1}
                            setBlock={setBlock1}
                        />
                        <SingleBlock
                            block={block2}
                            setBlock={setBlock2}
                        />
                        <SingleBlock
                            block={block3}
                            setBlock={setBlock3}
                        />
                        <SingleBlock
                            block={block4}
                            setBlock={setBlock4}
                        />
                        <SingleBlock
                            block={block5}
                            setBlock={setBlock5}
                        />
                    </div>
                </Container>
           </div>
        </SimpleBar>

    );
}

export default Blockchain;
