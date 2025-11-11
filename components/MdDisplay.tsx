import ReactMarkdown from 'react-markdown';
import remarkSlug from 'remark-slug'
import remarkGfm from 'remark-gfm'

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
        <ReactMarkdown 
            remarkPlugins={[remarkSlug, remarkGfm]}>
            {content}
        </ReactMarkdown>
    );
};
export default MdDisplay;