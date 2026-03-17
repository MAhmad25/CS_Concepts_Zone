import { useNavigate, useParams } from "react-router-dom";
import { WritePost, useScrollTop } from "./index";
import { useLayoutEffect, useState } from "react";
import documentService from "../app/DocService";

const EditPost = () => {
      document.title = "Wanna change something got for it";
      const navigate = useNavigate();
      const { id } = useParams();
      useScrollTop();
      const [postObj, setPostObj] = useState({});
      useLayoutEffect(() => {
            if (id) {
                  try {
                        documentService.getSinglePost(id).then((postData) => {
                              setPostObj(postData);
                        });
                  } catch (error) {
                        console.log(error.message);
                        navigate("/");
                  }
            } else navigate("/");
      }, [id, navigate]);
      return <WritePost editPost={postObj} />;
};

export default EditPost;
