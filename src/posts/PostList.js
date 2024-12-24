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
const useDebounce = (value, delay) => {
  //디바운스를 하기 위한 커스텀 훅
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PostList = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const navigater = useNavigate();

  const debouncedSearch = useDebounce(search, 300);

  const fetchData = async () => {
    const res = await fetch("http://localhost:5001/api/posts");
    const data = await res.json();
    setList(data.posts);
  };

  const searchData = async (search) => {
    const res = await fetch(`http://localhost:5001/api/posts/search/${search}`);
    const data = await res.json();
    setList(data.posts);
  };

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("search");
    console.log(savedSearch);
    if (savedSearch && savedSearch !== "") {
      setSearch(savedSearch);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    // 검색어가 비어 있으면 데이터를 초기화
    if (debouncedSearch.trim() === "") {
      fetchData();
    } else {
      searchData(debouncedSearch);
    }

    sessionStorage.setItem("search", debouncedSearch.trim());
  }, [debouncedSearch]);

  return (
    <>
      <button
        onClick={() => {
          navigater("/posts/write");
        }}
      >
        글 작성
      </button>
      <Container>
        <input
          placeholder="검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />

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
            </PostCard>
          ))
        ) : (
          <NoPostsMessage>No posts available</NoPostsMessage>
        )}
      </Container>
    </>
  );
};

export default PostList;
