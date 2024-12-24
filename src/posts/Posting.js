import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const ArticleWrapper = styled.article`
  font-family: "Times New Roman", serif;
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  line-height: 1.8;
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

const AdminButton = styled.button`
  background-color: #ff6347;
  color: white;
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4500;
  }
`;

const CommentWrapper = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
`;

const CommentButton = styled.button`
  background-color: #1e90ff;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4682b4;
  }
`;

const CommentList = styled.ul`
  margin-top: 20px;
  list-style-type: none;
  padding-left: 0;
`;

const CommentItem = styled.li`
  background-color: #fff;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NoPostMessage = styled.div`
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
    if (!loading) {
      if (admin) {
        console.log("관리자 로그인됨");
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
              <AdminButton
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
              </AdminButton>
              <AdminButton
                onClick={() => {
                  navigater(`/posts/write/${PostId}`);
                }}
              >
                수정
              </AdminButton>
            </>
          )}
          <ArticleWrapper>
            <Title>{post.Title}</Title>
            <AuthorAndDate>
              <strong>By {post.Author}</strong> |{" "}
            </AuthorAndDate>

            <Content>
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => (
                    <img style={{ maxWidth: "100%" }} {...props} alt="" />
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const language = className?.replace(/language-/, "");
                    return !inline ? (
                      <SyntaxHighlighter
                        language={language}
                        style={solarizedlight}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {post.Content}
              </ReactMarkdown>
            </Content>

            <HeartSection>❤️ {Heart} Likes</HeartSection>
            <LikeButton onClick={upHeart}>Like</LikeButton>
          </ArticleWrapper>
          <CommentWrapper>
            <form>
              <CommentInput
                placeholder="댓글 달기"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <CommentButton
                type="submit"
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
                    setComment("");
                    fetchData();
                  } else {
                    alert("로그인이 안되어있어요 😥");
                  }
                }}
              >
                댓글 남기기
              </CommentButton>
              <CommentList>
                {comments.map((item) => {
                  return (
                    <CommentItem key={item.CommentId}>
                      <div>
                        <strong>{item.Name}</strong>
                      </div>
                      <div>{item.Content}</div>
                      <div>{item.Time}</div>
                      {admin && (
                        <CommentActions>
                          <button
                            onClick={async () => {
                              const choice =
                                window.confirm("🫨 삭제하시겠습니까?");
                              if (choice) {
                                const res = await fetch(
                                  `http://localhost:5001/api/posts/delete/comment/${item.CommentId}`
                                );
                                console.log("성공적으로 삭제했습니다🔥");
                                fetchData(); // 댓글 삭제 후 다시 데이터를 불러옴
                              } else {
                                alert("삭제가 취소되었습니다!");
                              }
                            }}
                          >
                            삭제
                          </button>
                        </CommentActions>
                      )}
                    </CommentItem>
                  );
                })}
              </CommentList>
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
