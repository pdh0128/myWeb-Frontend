import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Post from "./posts/post";
import Login from "./login";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/posts/*" element={<Post />} />
          <Route path="/login/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
