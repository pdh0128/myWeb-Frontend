import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

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
  white-space: pre-line;
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
const CommentWrapper = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const Posting = () => {
  const PostId = useParams().PostId;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [Heart, setHeart] = useState(0);
  const navigater = useNavigate();

  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async () => {
    const res = await fetch("http://localhost:5001/api/login/checkAdmin", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setAdmin(data["isAdmin"]);
    setLoading(false);
  };

  const fetchData = async () => {
    const res = await fetch(`http://localhost:5001/api/posts/post/${PostId}`);
    const data = await res.json();
    setPost(data.post);
    setComments(data.comments);
  };

  const upHeart = async () => {
    const res = await fetch(
      `http://localhost:5001/api/posts/post/${PostId}/${Heart + 1}`
    );
    setHeart((prev) => prev + 1);
  };

  useEffect(() => {
    fetchData();
    checkAdmin();
  }, []);

  useEffect(() => {
    if (post !== undefined) {
      setHeart(post.Heart);
    }
  }, [post]);

  useEffect(() => {
    console.log("안녕!");
    if (!loading) {
      if (admin) {
        console.log("박동현");
      }
    }
  }, [admin, loading]);

  useEffect(() => {
    console.log("댓글 : ", comments);
  }, [comments]);

  return (
    <>
      {post ? (
        <>
          {admin && (
            <>
              <button
                onClick={async () => {
                  const choice = prompt(
                    `삭제하기 위해 '${PostId}:${post.Title}'를 입력하세요`
                  );
                  if (choice === `${PostId}:${post.Title}`) {
                    const res = await fetch(
                      `http://localhost:5001/api/posts/delete/posting/${PostId}`
                    );
                    alert("성공적으로 삭제했습니다🔥");
                    navigater("/posts");
                  } else {
                    alert("삭제가 취소되었습니다!");
                  }
                }}
              >
                삭제
              </button>
              <button
                onClick={() => {
                  navigater(`/posts/write/${PostId}`);
                }}
              >
                수정
              </button>
            </>
          )}
          <ArticleWrapper>
            <Title>{post.Title}</Title>
            <AuthorAndDate>
              <strong>By {post.Author}</strong> |{" "}
            </AuthorAndDate>

            <Content>
              <ReactMarkdown>{post.Content}</ReactMarkdown>
            </Content>

            <HeartSection>❤️ {Heart} Likes</HeartSection>
            <LikeButton onClick={upHeart}>Like</LikeButton>
          </ArticleWrapper>
          <CommentWrapper>
            <form>
              <input
                placeholder="댓글 달기"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <button
                type="submmit"
                onClick={async (e) => {
                  e.preventDefault();
                  const res = await fetch(
                    "http://localhost:5001/api/login/userInfo",
                    {
                      credentials: "include",
                    }
                  );
                  let data = await res.json();
                  data = data["user"][0];
                  if (data != undefined) {
                    const userId = data["UserId"];
                    const name = data["Name"];
                    const content = comment;
                    console.log(
                      "게시물 정보 : ",
                      PostId,
                      userId,
                      name,
                      content
                    );

                    const res1 = await fetch(
                      "http://localhost:5001/api/posts/comment",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          PostId: PostId,
                          UserId: userId,
                          Name: name,
                          Content: content,
                        }),
                      }
                    );
                    fetchData();
                  } else {
                    alert("로그인이 안되어있어요 😥");
                  }
                }}
              />
              <ul>
                {comments.map((item) => {
                  return (
                    <li key={item.CommentId}>
                      <div>{item.Name}</div>
                      <div>{item.Content}</div>
                      <div>{item.Time}</div>
                      {admin && (
                        <>
                          <button
                            onClick={async () => {
                              const choice =
                                window.confirm("🫨 삭제하시겠습니까?");
                              if (choice) {
                                const res = await fetch(
                                  `http://localhost:5001/api/posts/delete/comment/${item.CommentId}`
                                );
                                console.log("성공적으로 삭제했습니다🔥");
                              } else {
                                alert("삭제가 취소되었습니다!");
                              }
                            }}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </form>
          </CommentWrapper>
        </>
      ) : (
        <NoPostMessage>게시물이 없거나 불러오는 중입니다!</NoPostMessage>
      )}
    </>
  );
};

export default Posting;
