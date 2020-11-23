import './tailwind.output.css'
import logo from './logo.svg';
import './App.css';
import InputBox from './components/InputBox'

function App() {
  return (
    <div className="App">
      <header className="App-header">
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
		<div className="flex flex-row w-full">
			<div className="flex-auto bg-blue-300">Hi There</div>
			<div className="flex-auto bg-blue-500"><InputBox /></div>
		</div>
      </header>
    </div>
  );
}

export default App;
