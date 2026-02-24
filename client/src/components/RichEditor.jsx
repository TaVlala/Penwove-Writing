import React, { useRef, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import { Comment } from '../extensions/Comment';
import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import * as PMView from '@tiptap/pm/view';
const { Decoration, DecorationSet } = PMView;

const RichEditor = forwardRef(function RichEditor(
  { initialContent = '', onChange, onSubmit, placeholder, otherCursors = {}, onSelectionUpdate, onCommentClick, onInlineCommentCreate, editable = true },
  ref
) {
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);
  const onSelectionUpdateRef = useRef(onSelectionUpdate);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);
  useEffect(() => { onSelectionUpdateRef.current = onSelectionUpdate; }, [onSelectionUpdate]);

  const CursorExtension = useMemo(() => {
    return Extension.create({
      name: 'cursors',
      addOptions() {
        return {
          otherCursors: {},
        };
      },
      addProseMirrorPlugins() {
        const extension = this;
        return [
          new Plugin({
            props: {
              decorations(state) {
                const decos = [];
                const cursors = extension.options.otherCursors || {};

                Object.entries(cursors).forEach(([userId, data]) => {
                  if (!data) return;
                  const { position, color, name } = data;
                  if (position === null || position === undefined) return;

                  const docSize = state.doc.content.size;
                  const pos = Math.min(Math.max(0, position), docSize);

                  const widget = document.createElement('span');
                  widget.className = 'collaboration-cursor';
                  widget.style.borderLeftColor = color;

                  const label = document.createElement('span');
                  label.className = 'collaboration-cursor-label';
                  label.style.backgroundColor = color;
                  label.innerText = name || 'Anonymous';
                  widget.appendChild(label);

                  decos.push(Decoration.widget(pos, widget));
                });
                return DecorationSet.create(state.doc, decos);
              },
            },
          }),
        ];
      },
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'rich-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rich-image',
        },
      }),
      Highlight.configure({ multicolor: true }),
      BubbleMenuExtension,
      Comment,
      CursorExtension,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        spellcheck: 'true',
        'data-placeholder': placeholder || '',
      },
      handleKeyDown(_view, event) {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          onSubmitRef.current?.();
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      onChangeRef.current?.(editor.getHTML(), editor.isEmpty);
    },
    onSelectionUpdate({ editor }) {
      onSelectionUpdateRef.current?.(editor.state.selection.head);
    },
  });

  // Reactive options update
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setOptions({
        cursors: {
          otherCursors,
        },
      });
    }
  }, [editor, otherCursors]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  useImperativeHandle(ref, () => ({
    clearContent() {
      editor?.commands.clearContent(true);
    },
    focus() {
      editor?.commands.focus();
    },
  }), [editor]);

  if (!editor) return null;

  return (
    <div
      className={`rich-editor${!editable ? ' rich-editor--readonly' : ''}`}
      onClick={e => {
        const target = e.target.closest('.inline-comment');
        if (target) {
          const commentId = target.getAttribute('data-comment-id');
          if (commentId) onCommentClick?.(commentId);
        }
      }}
    >
      {editable && (
        <div className="rich-editor-toolbar">
          <button
            type="button"
            className={`toolbar-btn${editor.isActive('bold') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
            title="Bold (Ctrl+B)"
          ><b>B</b></button>

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('italic') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
            title="Italic (Ctrl+I)"
          ><i>I</i></button>

          <div className="toolbar-divider" />

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('heading', { level: 1 }) ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
            title="Heading 1"
          >H1</button>

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('heading', { level: 2 }) ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
            title="Heading 2"
          >H2</button>

          <div className="toolbar-divider" />

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('bulletList') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
            title="Bullet list"
          >• List</button>

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('orderedList') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
            title="Ordered list"
          >1. List</button>

          <div className="toolbar-divider" />

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('blockquote') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
            title="Blockquote"
          >❝</button>

          <div className="toolbar-divider" />

          <button
            type="button"
            className={`toolbar-btn${editor.isActive({ textAlign: 'left' }) ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run(); }}
            title="Align left"
          >≡L</button>

          <button
            type="button"
            className={`toolbar-btn${editor.isActive({ textAlign: 'center' }) ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run(); }}
            title="Align center"
          >≡C</button>

          <button
            type="button"
            className={`toolbar-btn${editor.isActive({ textAlign: 'right' }) ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run(); }}
            title="Align right"
          >≡R</button>

          <button
            type="button"
            className={`toolbar-btn${editor.isActive({ textAlign: 'justify' }) ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().setTextAlign('justify').run(); }}
            title="Justify"
          >≡J</button>

          <div className="toolbar-divider" />

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('link') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => {
              e.preventDefault();
              const previousUrl = editor.getAttributes('link').href;
              const url = window.prompt('URL', previousUrl);
              if (url === null) return;
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            title="Link"
          >🔗</button>

          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={e => {
              e.preventDefault();
              const url = window.prompt('Image URL');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            title="Image"
          >🖼️</button>

          <div className="toolbar-divider" />

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('highlight') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHighlight().run(); }}
            title="Highlight"
          >🖍️</button>

          <button
            type="button"
            className={`toolbar-btn${editor.isActive('comment') ? ' toolbar-btn--active' : ''}`}
            onMouseDown={e => {
              e.preventDefault();
              if (editor.isActive('comment')) {
                editor.chain().focus().unsetComment().run();
              } else {
                const text = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);
                if (!text.trim()) {
                  alert('Please select some text to comment on.');
                  return;
                }
                const commentId = `comment-${Date.now()}`;
                editor.chain().focus().setComment(commentId, 'You').run();
                // In a real app, we'd open a modal here to type the comment
              }
            }}
            title="Inline Comment"
          >💬+</button>
        </div>
      )}

      <EditorContent editor={editor} />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} shouldShow={({ editor, from, to }) => {
          return !editor.isDestroyed && from !== to;
        }}>
          <div className="bubble-menu">
            <button
              className="bubble-menu-btn"
              onClick={() => {
                const commentId = `comment-${Date.now()}`;
                editor.chain().focus().setComment(commentId, 'You').run();
                if (!editable) {
                  onInlineCommentCreate?.(commentId, editor.getHTML());
                }
              }}
            >
              💬 Comment
            </button>
            <button
              className="bubble-menu-btn"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              🖍️ Highlight
            </button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
});

export default RichEditor;
