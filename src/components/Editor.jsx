import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { LuFileUp, LuLoaderCircle } from "react-icons/lu";

const contentHasValue = (content) => {
      if (!content) return false;
      if (typeof content === "string") return Boolean(content.trim());
      if (!Array.isArray(content)) return true;

      return content.some((item) => {
            if (typeof item === "string") return Boolean(item.trim());
            if (item?.type === "text") return Boolean(item.text?.trim());
            if (item?.content) return contentHasValue(item.content);

            return Boolean(item?.text || item?.href || item?.url);
      });
};

const blockHasValue = (block) => {
      if (contentHasValue(block?.content)) return true;
      return block?.children?.some(blockHasValue) || false;
};

const documentIsEmpty = (blocks) => !blocks.some(blockHasValue);

const Editor = forwardRef(function Editor({ initialHTML = "" }, ref) {
      const [pdfImporting, setPdfImporting] = useState(false);
      const [pdfStatus, setPdfStatus] = useState("");
      const [pdfError, setPdfError] = useState("");
      const pdfInputRef = useRef(null);

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

      const insertPdfHtml = (html) => {
            const blocks = editor.tryParseHTMLToBlocks(html);

            if (!blocks.length) {
                  throw new Error("The PDF text could not be converted into editor blocks.");
            }

            const existingBlocks = editor.document;
            const isEmpty = documentIsEmpty(existingBlocks);
            const insertedBlocks = isEmpty ? editor.replaceBlocks(existingBlocks, blocks).insertedBlocks : editor.insertBlocks(blocks, existingBlocks.at(-1), "after");
            const lastInsertedBlock = insertedBlocks.at(-1);

            if (lastInsertedBlock) {
                  editor.setTextCursorPosition(lastInsertedBlock, "end");
            }
      };

      const handlePdfImport = async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";

            if (!file) return;

            try {
                  setPdfImporting(true);
                  setPdfError("");
                  setPdfStatus("Reading PDF...");

                  const { pdfFileToHtml } = await import("../utils/pdfToHtml");
                  const html = await pdfFileToHtml(file, ({ pageNumber, pageCount }) => {
                        setPdfStatus(`Reading page ${pageNumber} of ${pageCount}...`);
                  });

                  insertPdfHtml(html);
                  editor.focus();
                  setPdfStatus(`Imported ${file.name}`);
            } catch (error) {
                  console.error(error);
                  setPdfStatus("");
                  setPdfError(error?.message || "Unable to import this PDF.");
            } finally {
                  setPdfImporting(false);
            }
      };

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

      return (
            <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 px-10">
                        <input ref={pdfInputRef} className="hidden" type="file" accept="application/pdf,.pdf" onChange={handlePdfImport} />
                        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--color-bl)]/20 px-3 text-sm font-medium text-[var(--color-bl)] transition hover:bg-[var(--color-bl)] hover:text-[var(--color-wht)] disabled:cursor-not-allowed disabled:opacity-60" onClick={() => pdfInputRef.current?.click()} disabled={pdfImporting} title="Import PDF">
                              {pdfImporting ? <LuLoaderCircle className="h-4 w-4 animate-spin" /> : <LuFileUp className="h-4 w-4" />}
                              {pdfImporting ? "Importing" : "Import PDF"}
                        </button>
                        {pdfStatus && (
                              <p className="text-sm text-[var(--color-bl)]/70" aria-live="polite">
                                    {pdfStatus}
                              </p>
                        )}
                        {pdfError && (
                              <p className="text-sm text-red-500" aria-live="assertive">
                                    {pdfError}
                              </p>
                        )}
                  </div>
                  <BlockNoteView editor={editor} filePanel={true} formattingToolbar={true} theme="light" />
            </div>
      );
});

export default Editor;
