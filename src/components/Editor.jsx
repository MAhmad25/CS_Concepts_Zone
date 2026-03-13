import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const Editor = forwardRef(function Editor({ initialHTML = "" }, ref) {
      async function uploadFile(file) {
            const body = new FormData();
            body.append("file", file);
            const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
                  method: "POST",
                  body: body,
            });
            return (await ret.json()).data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      }
      const editor = useCreateBlockNote({ uploadFile });
      const hydratedOnceRef = useRef(false);
      useEffect(() => {
            if (hydratedOnceRef.current) return;
            if (!initialHTML) return;
            hydratedOnceRef.current = true;

            let cancelled = false;
            (() => {
                  const blocks = editor.tryParseHTMLToBlocks(initialHTML);
                  if (cancelled) return;
                  editor.replaceBlocks(editor.document, blocks);
            })();

            return () => {
                  cancelled = true;
            };
      }, [editor, initialHTML]);

      useImperativeHandle(
            ref,
            () => ({
                  getHTML() {
                        return editor.blocksToFullHTML(editor.document);
                  },
                  getJSON() {
                        return editor.document;
                  },
            }),
            [editor],
      );

      return <BlockNoteView editor={editor} filePanel={true} formattingToolbar={true} theme="light" />;
});

export default Editor;
