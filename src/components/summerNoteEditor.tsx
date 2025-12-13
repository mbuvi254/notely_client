// src/components/SummernoteEditor.tsx
import { useEffect, useRef, useCallback } from "react";
import $ from "jquery";
import "summernote/dist/summernote-lite.min.js";
import "summernote/dist/summernote-lite.min.css";
import "./summernote-custom.css";

// Extend jQuery interface to include summernote
declare global {
  interface JQuery {
    summernote(options?: any): JQuery;
    summernote(command: string, ...args: any[]): any;
  }
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  uploadImage?: (file: File) => Promise<string>; // returns URL
  disabled?: boolean;
  onInit?: () => void;
  onFullscreen?: (isFullscreen: boolean) => void;
}

export default function SummernoteEditor({
  value = "",
  onChange,
  placeholder = "Write your content...",
  height = 300,
  uploadImage,
  disabled = false,
  onInit,
  onFullscreen,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isInitialized = useRef(false);

  const handleImageUpload = useCallback((files: File[]) => {
    if (!uploadImage) {
      // default: insert local image as dataURL (not recommended for production)
      const reader = new FileReader();
      reader.onload = (e) => {
        $(rootRef.current!).summernote("insertImage", e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
      return;
    }

    // upload to server and insert returned URL
    (async () => {
      try {
        const url = await uploadImage(files[0]);
        $(rootRef.current!).summernote("insertImage", url);
      } catch (err) {
        console.error("Upload failed", err);
      }
    })();
  }, [uploadImage]);

  useEffect(() => {
    if (!rootRef.current || isInitialized.current) return;

    const $el = $(rootRef.current);

    $el.summernote({
      placeholder,
      height,
      tabsize: 2,
      dialogsInBody: true,
      dialogsFade: true,
      disableDragAndDrop: false,
      shortcuts: true,
      spellCheck: true,
      disableGrammar: false,
      toolbar: [
        ["style", ["style"]],
        ["font", ["bold", "italic", "underline", "strikethrough", "clear", "superscript", "subscript"]],
        ["fontname", ["fontname"]],
        ["fontsize", ["fontsize"]],
        ["color", ["color"]],
        ["para", ["ul", "ol", "paragraph", "height"]],
        ["insert", ["link", "picture", "video", "table", "hr", "emoji"]],
        ["view", ["fullscreen", "codeview", "help"]],
        ["misc", ["undo", "redo"]],
      ],
      fontNames: [
        "Arial", "Arial Black", "Comic Sans MS", "Courier New", 
        "Helvetica", "Impact", "Tahoma", "Times New Roman", 
        "Verdana", "Inter", "Roboto", "Open Sans"
      ],
      fontSizes: [
        "8", "9", "10", "11", "12", "14", "16", "18", "20", 
        "24", "28", "32", "36", "48", "64"
      ],
      colors: [
        [
          "#000000", "#424242", "#636363", "#9C9C94", "#CEC6CE", "#EFEFEF", "#F7F7F7", "#FFFFFF"
        ],
        [
          "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#9900FF", "#FF00FF"
        ],
        [
          "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3", "#CFE2F3", "#D9D2E9", "#EAD1DC"
        ],
        [
          "#DB4D4D", "#E2713A", "#F4C042", "#5B9E5B", "#4A86B8", "#6C6EBF", "#B4A7D6", "#E07B98"
        ],
        [
          "#CC0000", "#E69138", "#F1C232", "#6AA84F", "#3D85C6", "#674EA7", "#A64D79", "#DD5588"
        ],
        [
          "#990000", "#B45F06", "#BF9000", "#38761D", "#134F5C", "#351C75", "#741B47", "#C14260"
        ],
        [
          "#660000", "#783F04", "#7F6000", "#274E13", "#0C343D", "#20124D", "#4C1030", "#8C2E3E"
        ]
      ],
      lineHeights: ["1.0", "1.2", "1.4", "1.5", "1.6", "1.8", "2.0", "3.0"],
      callbacks: {
        onInit: function() {
          isInitialized.current = true;
          // Set initial value after initialization
          if (value) {
            $el.summernote("code", value);
          }
          if (onInit) {
            onInit();
          }
        },
        onChange: function (contents: string) {
          onChange(contents);
        },
        onImageUpload: function (files: File[]) {
          handleImageUpload(files);
        },
        onFullscreen: function(isFullscreen: boolean) {
          if (onFullscreen) {
            onFullscreen(isFullscreen);
          }
          // Add custom styling for fullscreen mode
          if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            // Add z-index to ensure fullscreen is on top
            $('.note-fullscreen-body').css('z-index', '9999');
          } else {
            document.body.style.overflow = '';
          }
        },
        onPaste: function(e: any) {
          // Clean up pasted content
          const clipboardData = (e.originalEvent || e).clipboardData;
          const bufferText = clipboardData ? clipboardData.getData('text/plain') : '';
          e.preventDefault();
          document.execCommand('insertText', false, bufferText);
        },
      },
    });

    return () => {
      if (isInitialized.current) {
        $el.summernote("destroy");
        isInitialized.current = false;
        // Restore body overflow
        document.body.style.overflow = '';
      }
    };
  }, []); // Only run once on mount

  // Update value when prop changes (but not during user typing)
  useEffect(() => {
    if (!isInitialized.current) return;
    
    const $el = $(rootRef.current!);
    if ($el.summernote) {
      const currentCode = $el.summernote("code") as unknown as string;
      if (currentCode !== value) {
        $el.summernote("code", value || "");
      }
    }
  }, [value]);

  // Handle disabled state
  useEffect(() => {
    if (!isInitialized.current) return;
    
    const $el = $(rootRef.current!);
    if ($el.summernote) {
      $el.summernote(disabled ? "disable" : "enable");
    }
  }, [disabled]);

  return <div ref={rootRef} className="summernote-editor" />;
}
