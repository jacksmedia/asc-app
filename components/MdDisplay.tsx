import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';

interface MdDisplayProp {
    mdFile: string;
}

function MdDisplay({mdFile}: MdDisplayProp) {
    const [content, setContent] = useState('')
    
    useEffect(() => {
        fetch(mdFile)
        .then(res => res.text())
        .then(text => setContent(text))
    }, [mdFile])
    
    return(
        <>
        <ReactMarkdown>
            {content}
        </ReactMarkdown>
        
        <style tsx>{`
        * {
        color: #ffc;
        }
        p {
        max-width: 80vw;
        }
        strong {
        font-size: 130%;
        }
        `}</style>
        </>
    );
};
export default MdDisplay;