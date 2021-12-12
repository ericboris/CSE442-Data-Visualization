import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { sha256 } from 'js-sha256';
import MineSettings from './MineSettings';
import { BLUE } from './ColorSettings';

// Parse the mining settings.
const difficulty = MineSettings.difficulty;
const maxNonce = MineSettings.maximumNonce;
const pattern = MineSettings.pattern;

function MineButton({blockNumber, data, prevHash="", block, nonce, setBlock, isSwitchOn}) {
    // Get the hash of the given inputs.
    const hash = (nonce) => sha256(blockNumber + nonce + data + prevHash);

    // Return true if the hash is signed and false otherwise.
    const isSigned = (hash) => hash.substr(0, difficulty) === pattern;

    // Recursively search for the nonce that results in a signed hash
    // Show every 10 results.
    const mineDelay = (nonce) => {
        setTimeout(() => {
            if (isSigned(hash(nonce))) {
                setIsMining(false);
                setBlock({...block, nonce});
                return;
            } else if (nonce % 5 === 0) {
                setBlock({...block, nonce});
            }
            mineDelay(nonce + 1);
        });
    }

    const mine = () => {
        for (let nonce = 0; nonce <= maxNonce; nonce++) {
            if (isSigned(hash(nonce))) {
                setIsMining(false);
                setBlock({...block, nonce});
                return;
            }
        }
    }

    // Begin mining.
    const handleClick = () => {
        if (!isMining) {
            setIsMining(true);
            if(isSwitchOn){
                if(!isSigned(hash(nonce))){
                    mineDelay(0)
                }else {
                    mineDelay(nonce)
                }
            } else {
                mine(blockNumber, data, prevHash)
            }
        }
    }

    // Used to set the button text.
    const [isMining, setIsMining] = useState(false);

    return (
        <Button
            style={{
                'backgroundColor': BLUE
            }}
            onClick={() => handleClick()}
        >
            {isMining ? 'Mining...' : 'Mine!'}
        </Button>
    );
};

export { MineButton }
