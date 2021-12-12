import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import Blockchain from './Blockchain'
import { SecondTitleField } from './Fields';
import DefaultBlocks from './DefaultBlocks';
import { CONSENSUS_RED, CONSENSUS_GREEN } from './ColorSettings';

// Define component globals.                                                      
/*
const GREEN = '#43AA8B';
const RED = '#f94144';
*/

const defaultHash = DefaultBlocks.block3.hash;

function Distributed() {
    // The last hash of each of the blockchains.
    const [hash1, setHash1] = useState(defaultHash);
    const [hash2, setHash2] = useState(defaultHash);
    const [hash3, setHash3] = useState(defaultHash);

    // Return the most common hash if one exists, otherwise return 0.
    const consensus = () => {
       if (hash1 === hash2 || hash1 === hash3) {
            return hash1;
       } else if (hash2 === hash3) {
            return hash2;
       } else {
            return 0;
       }
    }

    // Select the background color.
    const color = (hash) => hash === consensus() ? CONSENSUS_GREEN : CONSENSUS_RED;

    return (
        <Container fluid>
            <div style={{'backgroundColor':color(hash1)}}>
                <SecondTitleField titleText={'Peer A'} /> 
                <Blockchain setLastHash={setHash1} />
            </div>
            <div style={{'backgroundColor':color(hash2)}}>
                <SecondTitleField titleText={'Peer B'} callback={(response) => this.handleUpdate(response)} />
                <Blockchain setLastHash={setHash2} />
            </div>
            <div style={{'backgroundColor':color(hash3)}}>
                <SecondTitleField titleText={'Peer C'} callback={(response) => this.handleUpdate(response)} />
                <Blockchain setLastHash={setHash3} />
            </div>
        </Container>
    );
}

export default Distributed;
