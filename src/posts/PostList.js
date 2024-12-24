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

const Heart = styled.span`
  font-size: 20px;
  color: #ff4d4f;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px 0;

  &:hover {
    background-color: #0056b3;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const useDebounce = (value, delay) => {
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
    if (savedSearch && savedSearch !== "") {
      setSearch(savedSearch);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      fetchData();
    } else {
      searchData(debouncedSearch);
    }
    sessionStorage.setItem("search", debouncedSearch.trim());
  }, [debouncedSearch]);

  return (
    <>
      <Button
        onClick={() => {
          navigater("/posts/write");
        }}
      >
        글 작성
      </Button>
      <Container>
        <SearchInput
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
              <div>
                <Heart>❤️</Heart> {item.Heart}
              </div>
            </PostCard>
          ))
        ) : (
          <NoPostsMessage>게시물이 없거나 불러오는 중입니다!</NoPostsMessage>
        )}
      </Container>
    </>
  );
};

export default PostList;
