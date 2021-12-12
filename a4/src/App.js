import React from 'react';
import Section from './components/Section';
import Hash from './components/Hash';
import Block from './components/Block';
import Blockchain from './components/Blockchain';
import Distributed from './components/Distributed';
import { introduction, hash, block, blockchain, distributed, conclusion } from './descriptions/descriptions'

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <Section
                    title={introduction.title}
                    body={introduction.body}
                />
                <Section
                    title={hash.title}
                    body={hash.body}
                    component={<Hash />}
                />
                <Section 
                    title={block.title}
                    body={block.body}
                    component={<Block />}
                />
                <Section 
                    title={blockchain.title}
                    body={blockchain.body}
                    component={<Blockchain />}
                />
                <Section
                    title={distributed.title}
                    body={distributed.body}
                    component={<Distributed />}
                />
                <Section
                    title={conclusion.title}
                    body={conclusion.body}
                />
            </div>
        );
    }
}

export default App;
