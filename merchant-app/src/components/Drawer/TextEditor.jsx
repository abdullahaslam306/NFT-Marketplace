import dynamic from "next/dynamic";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "react-quill/dist/quill.snow.css";
import { actions } from "../../actions";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

function TextEditor({ type, value, updateSectionId }) {
  const dispatch = useDispatch();
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { color: [] },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        "link",
      ],
    ],
    clipboard: { matchVisual: false },
  };

  const onfunChange = (content, delta, source, editor) => {
    if (type === "Description") {
      nftReducer.nftEditData.description = content;
      debounce(() => {
        dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
      }, 3000);
    } else if (
      nftReducer.sectionList &&
      nftReducer.sectionList[updateSectionId] &&
      nftReducer.sectionList[updateSectionId].attributes
    ) {
      nftReducer.sectionList[updateSectionId].attributes.content = content;
      debounce(() => {
        dispatch(actions.nftActions.setSectionData(nftReducer.sectionList));
      }, 3000);
    }
  };

  const emailInputRef = React.useRef(null);

  let timer;
  function debounce(fn, delay) {
    return (() => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(), delay);
    })();
  }

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onfunChange}
      modules={modules}
      // formats={formats}
      theme={"snow"}
      ref={emailInputRef}
    />
  );
}
export default TextEditor;
