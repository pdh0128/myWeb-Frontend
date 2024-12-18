import React from "react";
import { Route, Routes } from "react-router-dom";
import PostList from "./PostList";
import Write from "./write";
import Posting from "./Posting";
const Post = () => {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/write" element={<Write />} />
      <Route path="/:PostId" element={<Posting />} />
    </Routes>
  );
};

export default Post;
