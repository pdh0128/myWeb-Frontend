import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const ArticleWrapper = styled.article`
  font-family: "Times New Roman", serif;
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  line-height: 1.8; /* 줄 간격을 늘려서 읽기 좋게 설정 */
  background-color: #f9f9f9;
  color: #333;
  border-left: 5px solid #1e90ff;
  border-right: 5px solid #1e90ff;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #1e90ff;
  margin-bottom: 20px;
`;

const AuthorAndDate = styled.div`
  font-size: 1rem;
  color: #888;
  margin-bottom: 25px;
`;

const Content = styled.div`
  font-size: 1.2rem;
  color: #333;
  line-height: 1.8;
  margin-bottom: 30px;
  white-space: pre-line; /* 긴 텍스트가 있을 때 줄 바꿈을 자연스럽게 처리 */
`;

const HeartSection = styled.div`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 15px;
`;

const LikeButton = styled.button`
  background-color: #1e90ff;
  color: white;
  padding: 8px 16px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4682b4;
  }
`;

const NoPostMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const Posting = () => {
  const PostId = useParams().PostId;
  const [post, setPost] = useState();
  const [comments, setComments] = useState();
  const [Heart, setHeart] = useState(0);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:5001/api/posts/post/${PostId}`);
    const data = await res.json();
    setPost(data.post);
    setComments(data.Comments);
  };

  const upHeart = async () => {
    const res = await fetch(
      `http://localhost:5001/api/posts/post/${PostId}/${Heart + 1}`
    );
    setHeart((prev) => prev + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (post !== undefined) {
      setHeart(post.Heart);
    }
  }, [post]);

  return (
    <>
      {post ? (
        <ArticleWrapper>
          <Title>{post.Title}</Title>
          <AuthorAndDate>
            <strong>By {post.Author}</strong> |{" "}
          </AuthorAndDate>
          <Content>{post.Content}</Content>
          <HeartSection>❤️ {Heart} Likes</HeartSection>
          <LikeButton onClick={upHeart}>Like</LikeButton>
        </ArticleWrapper>
      ) : (
        <NoPostMessage>게시물이 없거나 불러오는 중입니다!</NoPostMessage>
      )}
    </>
  );
};

export default Posting;
