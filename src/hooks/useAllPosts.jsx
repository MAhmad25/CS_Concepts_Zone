import { useEffect } from "react";
import documentService from "../app/DocService";
import { useDispatch } from "react-redux";
import { setPosts } from "../store/reducers/postsSlice";
const useAllPosts = () => {
      const dispatch = useDispatch();
      useEffect(() => {
            (async () => {
                  const allPosts = await documentService.listPosts();
                  dispatch(setPosts(allPosts));
            })();
      }, [dispatch]);
};

export default useAllPosts;
