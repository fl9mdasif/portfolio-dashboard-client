"use client";

import { useCallback, useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  ImagePlus,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-react";

type Accent = "violet" | "teal";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  accent?: Accent;
  minHeight?: number;
}

/** Tailwind needs literal class strings, so keep both accents spelled out. */
const accentMap: Record<Accent, { active: string; ring: string }> = {
  violet: {
    active: "bg-violet-600/20 text-violet-300",
    ring: "focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/30",
  },
  teal: {
    active: "bg-teal-600/20 text-teal-300",
    ring: "focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30",
  },
};

/** True when the document holds nothing but empty markup. */
export const isEmptyHtml = (html: string) =>
  !html || html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write here...",
  disabled = false,
  accent = "violet",
  minHeight = 220,
}: RichTextEditorProps) => {
  const editor = useEditor({
    // Next.js SSR: let the editor mount on the client only.
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "tiptap-content focus:outline-none",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(isEmptyHtml(html) ? "" : html);
    },
  });

  // Sync when the parent swaps the record (e.g. editing a different blog).
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    const current = editor.getHTML();
    if (incoming !== current && isEmptyHtml(incoming) !== isEmptyHtml(current)) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL", "https://");
    if (url && url.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className="rounded-lg border border-white/[0.08] bg-[#161b27] animate-pulse"
        style={{ height: minHeight + 44 }}
      />
    );
  }

  return (
    <div
      className={`rounded-lg border border-white/[0.08] bg-[#161b27] overflow-hidden transition-colors ${accentMap[accent].ring} ${disabled ? "opacity-60" : ""}`}
    >
      <Toolbar
        editor={editor}
        accent={accent}
        disabled={disabled}
        onLink={setLink}
        onImage={addImage}
      />
      <EditorContent editor={editor} className="px-3 py-2.5 max-h-[45vh] overflow-y-auto" />
    </div>
  );
};

interface ToolbarProps {
  editor: Editor;
  accent: Accent;
  disabled: boolean;
  onLink: () => void;
  onImage: () => void;
}

interface BtnProps {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  active?: boolean;
  enabled?: boolean;
  accent: Accent;
  disabled: boolean;
}

const Btn = ({ onClick, label, children, active, enabled = true, accent, disabled }: BtnProps) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={!!active}
    onClick={onClick}
    disabled={disabled || !enabled}
    className={`p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      active ? accentMap[accent].active : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="w-px h-5 bg-white/[0.08] mx-0.5" />;

const Toolbar = ({ editor, accent, disabled, onLink, onImage }: ToolbarProps) => {
  const base = { accent, disabled };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.06] bg-[#0d1117]/60">
      <Btn {...base} label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={15} />
      </Btn>
      <Btn {...base} label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={15} />
      </Btn>
      <Btn {...base} label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline size={15} />
      </Btn>
      <Btn {...base} label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={15} />
      </Btn>
      <Btn {...base} label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code size={15} />
      </Btn>

      <Divider />

      <Btn {...base} label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={15} />
      </Btn>
      <Btn {...base} label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={15} />
      </Btn>
      <Btn {...base} label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={15} />
      </Btn>

      <Divider />

      <Btn {...base} label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={15} />
      </Btn>
      <Btn {...base} label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={15} />
      </Btn>
      <Btn {...base} label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={15} />
      </Btn>
      <Btn {...base} label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={15} />
      </Btn>

      <Divider />

      <Btn {...base} label="Add / edit link" active={editor.isActive("link")} onClick={onLink}>
        <LinkIcon size={15} />
      </Btn>
      <Btn {...base} label="Remove link" enabled={editor.isActive("link")} onClick={() => editor.chain().focus().unsetLink().run()}>
        <Unlink size={15} />
      </Btn>
      <Btn {...base} label="Insert image" onClick={onImage}>
        <ImagePlus size={15} />
      </Btn>
      <Btn {...base} label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting size={15} />
      </Btn>

      <div className="ml-auto flex items-center gap-0.5">
        <Btn {...base} label="Undo" enabled={editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={15} />
        </Btn>
        <Btn {...base} label="Redo" enabled={editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={15} />
        </Btn>
      </div>
    </div>
  );
};

export default RichTextEditor;
