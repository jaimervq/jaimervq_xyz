'use client';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


export default function Resume() {
    const [md, setMd] = useState("");

    useEffect(() => {
        fetch('/content/resume.md')
            .then((res) => res.text())
            .then(setMd);
    }, []);

    return (
        <>
            <main style={{ maxWidth: '800px', margin: 'auto', padding: '1rem' }}>
                <div className="markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
                </div>

                <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <a
                            href="/content/CV_JRQ.pdf"
                            download
                            className="download-btn"
                        >
                    <div className="project-card">
                            ⬇️ Download as PDF
                    </div>
                        </a>
                </section>
            </main>

        </>
    );
}
