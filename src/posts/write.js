import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const WritingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 20px;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 100%;
  outline: none;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 20px;

  &:focus {
    border-color: #007bff;
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #3e8e41;
  }
`;

const PreviewContainer = styled.div`
  width: 50%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const Write = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const imageFilePattern = /([a-zA-Z0-9_\-%.=&?\/:]*)\.(jpg|jpeg|png|gif)$/;
  const author = "박동현";
  const navigater = useNavigate();
  return (
    <Container>
      {/* 글 작성 */}
      <WritingContainer>
        <Input
          placeholder="제목을 입력하세요"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <Textarea
          placeholder="오늘의 하루는 어땠어? 🔥🔥"
          onChange={(e) => {
            const plusContent = e.target.value.replace(
              imageFilePattern,
              (match) => `![](${match})`
            );
            setContent(plusContent);
          }}
          value={content}
        />
        <Footer>
          <Button>나가기</Button>
          <Button
            onClick={async () => {
              if (content) {
                if (!title) setTitle("제목 없음");
                const res = await fetch(
                  "http://localhost:5001/api/posts/write",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      author: author,
                      title: title,
                      content: content,
                    }),
                  }
                );
                console.log(author, title, content);
                const data = await res.json();
                alert("🔥출간했어요🔥");
                navigater("/posts");
              } else {
                alert("내용을 작성해주세요!");
              }
            }}
          >
            출간하기
          </Button>
        </Footer>
      </WritingContainer>

      {/* 프리뷰 */}
      <PreviewContainer>
        <h2>{title || "제목 없음"}</h2>
        <hr />
        <ReactMarkdown>{content}</ReactMarkdown>
      </PreviewContainer>
    </Container>
  );
};

export default Write;
