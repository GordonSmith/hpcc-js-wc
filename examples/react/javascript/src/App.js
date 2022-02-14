import { HPCCZoomElement } from "@hpcc-js/wc-layout";
import logo from './logo.svg';
import './App.css';

HPCCZoomElement.register();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <hpcc-zoom style={{ width: "100%", height: "800px" }}>
          <h2>Try Dragging and Zooming Me</h2>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <h2>Try Dragging and Zooming Me</h2>
        </hpcc-zoom>
      </header>
    </div>
  );
}

export default App;
