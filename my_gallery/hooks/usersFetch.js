import { useEffect, useState } from "react";
import apiRequest from "../utils/request";
import { useDispatch } from "react-redux";
function useUserFetch() {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        await apiRequest
          .get(`/api/users/get_users`)
          .then((res) => {
            setUsers(res.data.users);
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

    fetchUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return { users, isLoading, error };
}

export default useUserFetch;
