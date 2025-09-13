import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useFetchVideo = (endpoint = "/movie/popular", page = 1) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(endpoint, { params: { page } });
        setVideos(res.data.results);
      } catch (err) {
        console.error("Ошибка загрузки фильмов:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, page]);

  return { videos, loading };
};

export default useFetchVideo;
