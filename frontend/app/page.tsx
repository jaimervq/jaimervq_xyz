'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/random_greeting`);
      const result = await response.text();
      setMessage(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error');
    }
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const [all_nodes_info, setAllNodesInfo] = useState("...");
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/all_nodes_info`)
      .then(res => res.text())
      .then(data => setAllNodesInfo(data))
      .catch(() => setAllNodesInfo("PySide2 visual node editor"));
  }, []);

  return (
    <>
      <main>
        <section className="greeting-box">
          <i>{message}</i>
        </section>

        <section>
          <h2>About Me</h2>
          <p>
            I'm Jaime, an Imaging TD and creative technologist. I tinker with Rust, Python, and other stuff for fun.
          </p>
          <p>
            My career started a while back in Madrid, Spain, where I worked at Skydance Animation as TA. There, I honed my skills in troubleshooting all kinds of errors that can arise in a production pipeline.
          </p>
          <p>
            Now, many years later, I have specialized in Imaging (compositing, color grading...), but always keep an eye out for the next challenge.
          </p>
        </section>

        <section>
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3>🦀 Rust + Next.js Portfolio</h3>
              <p>You're looking at it! Powered by Docker, Axum, and Next.js.
                <br/><br/>Source code on <a className="a-special" href="https://github.com/jaimervq/jaimervq_xyz" target="_blank" rel="noopener noreferrer">Github</a>.

              </p>
            </div>
            <div className="project-card">
              <h3>🐍 Qt-Based python node editor</h3>
              <p>{all_nodes_info}
                <br/><br/>Check it out <a className="a-special" href="https://github.com/jaimervq/all_nodes" target="_blank" rel="noopener noreferrer">here</a>.</p>
              <code>pip install all-nodes</code>
            </div>
            <div className="project-card">
              <h3>⭐ Other shenanigans</h3>
              <p>Visit <a className="a-special" href="https://vimeo.com/jaimervq" target="_blank" rel="noopener noreferrer">my Vimeo</a> or <a className="a-special" href="https://github.com/jaimervq" target="_blank" rel="noopener noreferrer">my Github</a>!</p>
              <div className="video-small">
                <iframe
                  src="https://player.vimeo.com/video/378892576?badge=0&autopause=0&background=1&player_id=0&app_id=58479&autoplay=1&loop=1#t=0s&background=1"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  title="Embedded Vimeo Video"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}