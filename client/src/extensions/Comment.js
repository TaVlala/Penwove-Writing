import { Mark, mergeAttributes } from '@tiptap/core';

export const Comment = Mark.create({
    name: 'comment',

    addAttributes() {
        return {
            commentId: {
                default: null,
                parseHTML: element => element.getAttribute('data-comment-id'),
                renderHTML: attributes => {
                    if (!attributes.commentId) {
                        return {};
                    }
                    return { 'data-comment-id': attributes.commentId };
                },
            },
            userName: {
                default: null,
                parseHTML: element => element.getAttribute('data-user-name'),
                renderHTML: attributes => {
                    if (!attributes.userName) return {};
                    return { 'data-user-name': attributes.userName };
                }
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-comment-id]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { class: 'inline-comment' }), 0];
    },

    addCommands() {
        return {
            setComment: (commentId, userName) => ({ commands }) => {
                return commands.setMark(this.name, { commentId, userName });
            },
            unsetComment: () => ({ commands }) => {
                return commands.unsetMark(this.name);
            },
        };
    },
});
