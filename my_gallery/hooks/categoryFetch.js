import { useEffect, useState } from "react";
import apiRequest from "../utils/request";
import { useDispatch } from "react-redux";

const useCategoryFetch = () => {
  const dispatch = useDispatch();
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        await apiRequest
          .get(`/api/category/get_categories`)
          .then((res) => {
            setCategoryList(res.data.categories);
            dispatch(
              categoryAction.setCategory({
                categoryList: res.data.categories,
              })
            );
          })
          .catch((error) => {
            setError(error.response.data.message);
          });
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [dispatch]);
  return { categoryList, isLoading, error };
};

export default useCategoryFetch;
