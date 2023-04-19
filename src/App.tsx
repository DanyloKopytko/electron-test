import React, { useEffect, useState } from "react";

import "./App.css";

// @ts-ignore
const { ipcRenderer } = window.electron;

interface IHighlights {
  title: string;
  text: string;
  url: string;
}

function App() {
  const [highlights, setHighlights] = useState<IHighlights[]>([]);
  const [browserViewUrl, setBrowserViewUrl] = useState("");

  useEffect(() => {
    const removeListener = ipcRenderer.on(
      "set-selected-text",
      (highlight: IHighlights) => {
        setHighlights((prevHighlights) => [...prevHighlights, highlight]);
      }
    );

    return () => removeListener();
  }, []);

  const goToUrl = () => ipcRenderer.sendSync("view-go-to", browserViewUrl);

  return (
    <div className="highlights">
      <div className="highlights-list">
        <h3>Your highlights:</h3>
        <hr />
        {highlights.length ? (
          highlights.map(({ title, text, url }) => (
            <div key={Math.random()}>
              <div>
                <h4>{title}</h4>
                <p>{url}</p>
              </div>
              <p>{text}</p>
            </div>
          ))
        ) : (
          <h3>No highlights yet!</h3>
        )}
      </div>
      <div className="highlights-webview">
        <input
          type="text"
          value={browserViewUrl}
          onChange={(e) => setBrowserViewUrl(e.target.value)}
        />
        <button onClick={goToUrl}>GO</button>
      </div>
    </div>
  );
}

export default App;
