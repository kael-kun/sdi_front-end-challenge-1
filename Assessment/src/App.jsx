import React from "react";
import { useState, useEffect } from "react";
import { IoIosShareAlt } from "react-icons/io";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
function App() {
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = "https://tmsph-sdi-challenges.pages.dev/challenges/";

  useEffect(() => {
    const fetchAuthorsAndArticles = async () => {
      try {
        const [authorsResponse, articlesResponse] = await Promise.all([
          fetch(
            "https://tmsph-sdi-challenges.pages.dev/challenges/authors.json"
          ),
          fetch("https://tmsph-sdi-challenges.pages.dev/challenges/news.json"),
        ]);

        if (!authorsResponse.ok || !articlesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const authors = await authorsResponse.json();
        const articles = await articlesResponse.json();

        const combined = articles.map((article) => {
          const author = authors.find((a) => a.id === article.author_id);
          return {
            ...article,
            image_url: baseURL + article.image_url,
            author: {
              ...author,
              avatar_url: baseURL + author.avatar_url,
            },
          };
        });

        setCombinedData(combined);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAuthorsAndArticles();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-white flex flex-col items-center justify-center lg:w-[80%] w-full mx-auto ">
      <div className="lg:w-[60%] w-full lg:p-10 p-2">
        {combinedData.map((article) => {
          const date = new Date(article.created_at);
          const day = date.toLocaleDateString("en-US", { day: "2-digit" });
          const month = date
            .toLocaleDateString("en-US", { month: "short" })
            .toUpperCase();

          return (
            <div className="shadow mt-10 p-[15px] mb-[20px]" key={article.id}>
              <div className="mb-[20px] shad pb-[20px] h-full w-full flex flex-col">
                <div className="">
                  <img src={article.image_url} alt={article.title} />
                  <div className="relative">
                    <div className="absolute mt-[-40px] ml-[30px] shape text-[13px] h-[60px] w-[100px] bg-[#FF0000] flex flex-col items-center justify-center text-white font-bold">
                      {day}
                      <br />
                      {month}
                      <div className="absolute triangle-topleft"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-[20px]">
                  <IoIosShareAlt />
                  <span className="self-end py-2">SHARE</span>
                </div>
              </div>
              <div className="mt-[5px] font-bold text-[#FF0000]">
                {article.author.name}
              </div>
              <div className="my-[10px]">
                <h2 className="font-bold text-[20px]">{article.title}</h2>
              </div>
              <div>
                <p>{article.body}</p>
                <div className="w-[200px] pt-[20px] flex items-center justify-start">
                  <h1 className="font-bold border-b-2 border-black">
                    READ ARTICLE
                  </h1>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-[100px]">
        <div>
          <Pagination
            count={57}
            page={11}
            defaultPage={9}
            boundaryCount={3}
            siblingCount={3}
            sx={{
              "& .MuiPaginationItem-root": {
                display: "flex",
                alignItems: "center",
                borderRadius: 0,
                border: "1px solid #E6E6E6",
                padding: "15px",
                height: "30px",
                "&:hover": {
                  backgroundColor: "#FF0000",
                },
              },
              "& .Mui-selected": {
                backgroundColor: "#FF0000 !important",
                color: "white !important",
              },
            }}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default App;
