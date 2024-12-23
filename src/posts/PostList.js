import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f1f7fc;
`;

const PostCard = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
  border-left: 8px solid #007bff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #007bff;
  margin-bottom: 10px;
`;

const Author = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
`;

const Content = styled.p`
  font-size: 16px;
  color: #333;
`;

const NoPostsMessage = styled.p`
  font-size: 18px;
  color: #555;
  margin-top: 20px;
  font-style: italic;
`;

const PostList = () => {
  const [list, setList] = useState([]);

  const fetchData = async () => {
    const res = await fetch("http://localhost:5001/api/posts");
    const data = await res.json();
    setList(data.posts);
  };
  const navigater = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      {list && list.length > 0 ? (
        list.map((item) => (
          <PostCard
            key={item.PostId}
            onClick={() => {
              navigater(`/posts/${item.PostId}`);
            }}
          >
            <Title>{item.Title}</Title>
            <Author>By {item.Author}</Author>
            <Content>{item.Content}</Content>
          </PostCard>
        ))
      ) : (
        <NoPostsMessage>No posts available</NoPostsMessage>
      )}
    </Container>
  );
};

export default PostList;
